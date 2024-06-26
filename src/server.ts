

import express from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import * as trpcExpress from '@trpc/server/adapters/express'
import { appRouter } from "./trpc";
import { inferAsyncReturnType } from "@trpc/server";
import bodyParser from "body-parser";
import { IncomingMessage } from "http";
import { stripeWebhookHandler } from "./webhooks";
import nextBuild from 'next/dist/build'
import { parse , UrlWithParsedQuery } from 'url'
import path from "path";
import { PayloadRequest } from "payload/types";


const app = express();

const PORT = process.env.PORT || 3000;

const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({
    req, res
})

export type ExpressContext = inferAsyncReturnType<typeof createContext>

export type webHookRequest = IncomingMessage & { rawBody: Buffer }

const start = async () => {

    const webHookMiddleware = bodyParser.json({
        verify: (req: webHookRequest, _, buffer) => {
            req.rawBody = buffer
        }
    })

    app.post("/api/webhook/stripe", webHookMiddleware, stripeWebhookHandler)

    const payload = await getPayloadClient({
        initOptions: {
            express: app,
            onInit: async (cms) => {
                cms.logger.info(`Admin URL ${cms.getAdminURL()}`)
            },
        },
    });

    if (process.env.NEXT_BUILD) {
        app.listen(PORT, async () => {
            payload.logger.info(
                'Next.js is building for production'
            )

            // @ts-expect-error
            await nextBuild(path.join(__dirname, '../'))

            process.exit()
        })

        return
    }

    const cartRouter = express.Router()

    cartRouter.use(payload.authenticate)

    cartRouter.get('/', (req, res) => {
        const request = req as PayloadRequest

        if (!request.user)
            return res.redirect('/sign-in?origin=cart')

        const parsedUrl : UrlWithParsedQuery  = parse(req.url , true)
        const {query} = parsedUrl

        return nextApp.render(req, res, '/cart', query)
    })

    app.use('/cart', cartRouter)

    app.use('/api/trpc', trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext
    }))

    app.use((req, res) => nextHandler(req, res))

    nextApp.prepare().then(() => {
        payload.logger.info('nextjs app started')

        app.listen(PORT, async () => {
            payload.logger.info(`next.js app URL : ${process.env.NEXT_PUBLIC_SERVER_URL} `)
        })
    })

}

start();