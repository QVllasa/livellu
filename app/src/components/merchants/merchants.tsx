import {useMerchants} from "@/framework/merchants";

export const Merchants = () => {
    const filter = {
        populate: 'logo_image'
    }
    const {merchants} = useMerchants(filter)

    return (
        <div className="bg-white sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto grid max-w-lg grid-cols-auto items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-auto">
                    {merchants.map((merchant, index) =>
                            merchant.logo_image?.data && <div key={index} className="col-span-1">
                                <img
                                    className="min-h-12 max-h-12 w-full object-contain"
                                    src={(process.env.NEXT_PUBLIC_STRAPI_HOST ?? '') + '' + merchant.logo_image?.data?.attributes?.url}
                                    alt={merchant.name}
                                    width={merchant.logo_image?.data?.attributes?.width}
                                    height={merchant.logo_image?.data?.attributes?.height}
                                />
                            </div>
                    )}
                </div>
            </div>
        </div>
    )
}

