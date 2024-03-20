import {useRouter} from "next/router";
import HomeLayout from "@/components/layouts/_home";
import {useArticle} from "@/framework/article";
import ReactMarkdown from 'react-markdown';
import Image from "next/image";

import {ArticleSection} from "@/types";
import {ProductsSlider} from "@/components/products/products-slider";
import {FALLBACK_IMG} from "@/lib/constants";


export const ArticlePage = () => {
    const router = useRouter();
    const {slug} = router.query;

    const filter = {
        filters: {
            slug: {
                $eq: slug
            }
        },
        populate: {
            sections: {
                populate: {
                    featured_image: "*",
                    images: "*"
                }
            },
            navigation_item: "*", // Add this line to populate the navigation field,
            featured_image: "*",
        }
    };
    const {article, loading, error} = useArticle(filter);


    console.log('article: ', article)

    if (!article || !slug) {
        return <div>Loading...</div>
    }

    const imgObj = article?.featured_image?.data ? article?.featured_image?.data.attributes : FALLBACK_IMG


    return (
        <div className=" px-6 lg:px-8 ">
            <div className='relative'>
                <div className="sticky top-20 z-20 overflow-hidden w-full backdrop-blur-2xl bg-white bg-opacity-80 py-8 rounded-b-3xl">
                    <div className='relative mx-auto max-w-7xl text-base leading-7 text-gray-700 lg:px-8 z-10'>
                        <p className="text-base font-semibold leading-7 text-indigo-600">{article?.navigation_item?.data?.attributes?.title}</p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">{article?.title}</h1>
                    </div>
                </div>
                <Image
                    src={process.env.NEXT_PUBLIC_STRAPI_HOST + imgObj.url}
                    width={imgObj.width}
                    height={imgObj.height}
                    alt=""
                    className="aspect-[5/2] w-full object-cover rounded-3xl mt-6 sm:mt-12"
                />
            </div>


            <div className="mx-auto text-base leading-7 text-gray-700">
                {article?.sections?.map((section, index) => <ArticleSection key={index} section={section} index={index}/>)}
            </div>
        </div>
    );
}


const ArticleSection = ({section, index}: { section: ArticleSection, index: number }) => {
    const isEven = index % 2 === 0;

    const filter = {
        pagination: {
            page: 1,
            pageSize: 10 // This sets the limit to 10 objects
        }
    };

    const imgObj = section?.featured_image?.data ? section?.featured_image?.data.attributes : FALLBACK_IMG


    return <>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10 ">
            <div className={`${isEven ? 'lg:col-start-1' : 'lg:col-start-2'}  lg:mx-auto lg:grid lg:w-full lg:max-w-7xl  lg:gap-x-8 lg:px-8`}>
                <div className="lg:pr-4">
                    <div className="lg:max-w-lg">
                        <ReactMarkdown
                            key={index}
                            components={{
                                h2: ({node, ...props}) => <h1 className={'mt-12 text-2xl font-bold tracking-tight text-gray-900'} {...props} />,
                                h3: ({node, ...props}) => <h1 className={'mt-12 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl'} {...props} />,
                                h4: ({node, ...props}) => <h1 className={'mt-12 text-lg font-bold tracking-tight text-gray-900 sm:text-xl'} {...props} />,
                                p: ({node, ...props}) => <p className={'mt-6'} {...props} />,
                                strong: ({node, ...props}) => <strong className={'font-semibold text-gray-900'} {...props} />,
                                ul: ({node, ...props}) => <ul className={'mt-8 text-gray-600 space-y-8'} {...props} />,
                                ol: ({node, ...props}) => <ul className={'mt-8 text-gray-600 space-y-8'} {...props} />,
                                li: ({node, ...props}) => <li className={''} {...props} />,
                                em: ({node, ...props}) => <em className={''} {...props} />,
                            }}
                        >
                            {section?.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
            <div className={` -ml-12 p-12 lg:sticky lg:top-20  ${isEven ? 'lg:col-start-2' : 'lg:col-start-1'} lg:row-span-2 lg:row-start-1 lg:overflow-hidden`}>
                <Image
                    src={process.env.NEXT_PUBLIC_STRAPI_HOST + imgObj?.url}
                    width={imgObj?.width}
                    height={imgObj?.height}
                    alt=""
                    className={`scale-x-[-100%]  w-[48rem] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]`}
                />
            </div>
        </div>
        <ProductsSlider filter={filter}/>
    </>

};


ArticlePage.getLayout = function getLayout(page: any) {
    return <HomeLayout>{page}</HomeLayout>;
};


export default ArticlePage;





