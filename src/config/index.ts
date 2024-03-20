

export const PRODUCT_CATAGORIES = [
    {
        lable:"UI-Kits",
        value:"ui_kits" as const,
        features : [
            {
                name : "Editor Picks",
                href : '#',
                image: "/nav/ui-kits/mixed.jpg"
            },
            {
                name : "New Arrivals",
                href : '#',
                image: "/nav/ui-kits/blue.jpg"
            },
            {
                name : "Bestsellers",
                href : '#',
                image: "/nav/ui-kits/purple.jpg"
            }
        ]
    },
    {
        lable:"Icons",
        value:"icons" as const,
        features : [
            {
                name : "favourite icon picks",
                href : '#',
                image: "/nav/icons/picks.jpg"
            },
            {
                name : "New Arrivals",
                href : '#',
                image: "/nav/icons/new.jpg"
            },
            {
                name : "Bestselling icons",
                href : '#',
                image: "/nav/icons/bestsellers.jpg"
            }
        ]
    }
]