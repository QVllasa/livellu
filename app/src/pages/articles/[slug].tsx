import {useRouter} from "next/router";
import HomeLayout from "@/components/layouts/_home";
import {useArticle} from "@/framework/article";
import ReactMarkdown from 'react-markdown';
import Image from "next/image";
import {CarouselContent, CarouselItem, Carousel, CarouselPrevious, CarouselNext} from "@/shadcn/components/ui/carousel";
import {Card, CardContent} from "@/shadcn/components/ui/card";
import {Button} from "@/shadcn/components/ui/button";





export const ArticlePage = () => {
    const router = useRouter();
    const {slug} = router.query;

    if (!slug) {
        return <div>Loading...</div>
    }

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

    if (!article) {
        return <div>Loading...</div>
    }

    return (
        <div className=" px-6 lg:px-8 ">
            <div className='relative'>
                <div className="sticky top-20 z-20 overflow-hidden w-full backdrop-blur-2xl bg-white bg-opacity-80 py-8">
                    <div className='mx-auto max-w-7xl text-base leading-7 text-gray-700 lg:px-8'>
                        <p className="text-base font-semibold leading-7 text-indigo-600">{article?.navigation_item?.data?.attributes?.title}</p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">{article?.title}</h1>
                    </div>
                </div>
                <Image
                    src={'http://localhost:1337' + article?.featured_image?.data?.attributes?.url}
                    width={article?.featured_image?.data?.attributes?.width}
                    height={article?.featured_image?.data?.attributes?.height}
                    alt=""
                    className="aspect-[5/2] w-full object-cover rounded-3xl mt-6 sm:mt-12"
                />
            </div>


            <div className="mx-auto text-base leading-7 text-gray-700">
                {article?.sections?.map((section, index) => {
                    const isEven = index % 2 === 0;
                    return <>
                        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10 ">
                            <div className={`lg:col-span-2 lg:col-start-${isEven ? '1' : '2'} lg:row-start-${isEven ? '1' : '2'} lg:mx-auto lg:grid lg:w-full lg:max-w-7xl  ${isEven ? 'lg:grid-cols-2' : ''} lg:gap-x-8 lg:px-8`}>
                                <div className="lg:pr-4">
                                    <div className="lg:max-w-lg">
                                        <ReactMarkdown
                                            key={index}
                                            children={section?.content}
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
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={` -ml-12 p-12 lg:sticky lg:top-20 lg:col-start-${isEven ? '2' : '1'} lg:row-span-${isEven ? '2' : '1'} lg:row-start-${isEven ? '1' : '2'} ${isEven ? '' : 'lg:grid-cols-2'} lg:overflow-hidden`}>
                                {section?.featured_image?.data && <Image
                                    src={'http://localhost:1337' + section?.featured_image?.data?.attributes?.url}
                                    width={section?.featured_image?.data?.attributes?.width}
                                    height={section?.featured_image?.data?.attributes?.height}
                                    alt=""
                                    className={`${isEven ? 'scale-x-[-100%]' : 'scale-x-[100%]'}  w-[48rem] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]`}
                                />}
                            </div>
                        </div>
                        <div className={'flex justify-center mt-24'}>
                            <Carousel
                                opts={{
                                    align: "center",
                                }}
                                className="w-full max-w-sm">
                                <CarouselContent>
                                    {Array.from({length: 5}).map((_, index) => (
                                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                            <div className="p-1">
                                                <Card>
                                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                                        <span className="text-3xl font-semibold">{index + 1}</span>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious/>
                                <CarouselNext/>
                            </Carousel>
                        </div>
                        <div className={'flex justify-center mt-8 mb-16'}>
                            <Button>Button</Button>
                        </div>
                    </>
                })}
            </div>
        </div>
    );
}


ArticlePage.getLayout = function getLayout(page: any) {
    return <HomeLayout>{page}</HomeLayout>;
};


export default ArticlePage;





