import Banner from '@/components/banners/banner';
import {Element} from 'react-scroll';
import type {HomePageProps} from '@/types';
import Categories from "@/components/categories/categories";


interface BlogPost {
    id: string;
    title: string;
    subtitle: string;
    imageURL: string;
    category: string;
}

interface BlogSection {
    id: string;
    title: string;
    subtitle: string;
    blogPosts: BlogPost[];
}

interface BlogTitleProps {
    title: string;
    subtitle: string;
}


export default function Modern({variables}: HomePageProps) {

    const blogSections: BlogSection[] = [
        {
            id: "1",
            title: 'Design-Inspirationen',
            subtitle: 'Lassen Sie sich von unseren neuesten Einrichtungsideen inspirieren.',
            blogPosts: [
                {
                    id: "design-1",
                    title: "Minimalismus im Wohnzimmer: Einfach und stilvoll",
                    subtitle: "Weniger ist mehr: Wie Sie mit Minimalismus Großes bewirken",
                    category: "Design-Inspirationen",
                    imageURL: "/articles/design/design1.png"
                },
                {
                    "id": "design-2",
                    "title": "Farbtrends 2024: Mut zur Farbe",
                    "subtitle": "Lebhafte Farben und ihre Wirkung in Ihrem Zuhause",
                    "category": "Design-Inspirationen",
                    "imageURL": "/articles/design/design2.png"
                },
                {
                    "id": "design-3",
                    "title": "Raumwunder: Kleine Räume groß gestalten",
                    "subtitle": "Effektive Tipps und Tricks für mehr Raumgefühl",
                    "category": "Design-Inspirationen",
                    "imageURL": "/articles/design/design3.png"
                },
                {
                    "id": "design-4",
                    "title": "Retro-Chic: Vintage-Möbel modern interpretiert",
                    "subtitle": "Altes neu entdecken: Einrichtungstipps mit Retro-Flair",
                    "category": "Design-Inspirationen",
                    "imageURL": "/articles/design/design4.png"
                }
            ]
        },
        {
            id: "2",
            title: 'DIY & Upcycling',
            subtitle: 'Ihre Kreativität kennt keine Grenzen.',
            blogPosts: [
                {
                    "id": "diy-1",
                    "title": "Upcycling-Ideen für alte Möbel",
                    "subtitle": "Neues Leben für alte Schätze: Einfache Upcycling-Projekte",
                    "category": "DIY & Upcycling",
                    "imageURL": "/articles/diy/diy1.png"
                },
                {
                    "id": "diy-2",
                    "title": "DIY-Anleitung: Palettenmöbel selbst bauen",
                    "subtitle": "Nachhaltig und individuell: Möbel aus Paletten",
                    "category": "DIY & Upcycling",
                    "imageURL": "/articles/diy/diy2.png"
                },
                {
                    "id": "diy-3",
                    "title": "Kreative Wandgestaltung: Ideen zum Selbermachen",
                    "subtitle": "Verleihen Sie Ihren Wänden eine persönliche Note",
                    "category": "DIY & Upcycling",
                    "imageURL": "/articles/diy/diy3.png"
                },
                {
                    "id": "diy-4",
                    "title": "Möbel restaurieren: Schritt für Schritt",
                    "subtitle": "Alte Möbelstücke in neuem Glanz",
                    "category": "DIY & Upcycling",
                    "imageURL": "/articles/diy/diy4.png"
                }
            ]
        },
        {
            id: "3",
            title: 'Leben & Wohnen',
            subtitle: 'Tipps für ein harmonisches und funktionelles Zuhause.',
            blogPosts: [
                {
                    "id": "wohnen-1",
                    "title": "Familienfreundlich einrichten: Sicher und stilvoll",
                    "subtitle": "Ein Zuhause schaffen, das für alle Generationen passt",
                    "category": "Leben & Wohnen",
                    "imageURL": "/articles/wohnen/wohnen1.png"
                },
                {
                    "id": "wohnen-2",
                    "title": "Nachhaltig wohnen: Umweltfreundliche Möbel",
                    "subtitle": "Grüne Möbeloptionen für ein nachhaltiges Heim",
                    "category": "Leben & Wohnen",
                    "imageURL": "/articles/wohnen/wohnen2.png"
                },
                {
                    "id": "wohnen-3",
                    "title": "Home Office einrichten: Produktivität und Stil",
                    "subtitle": "Tipps für ein effektives und angenehmes Arbeitsumfeld",
                    "category": "Leben & Wohnen",
                    "imageURL": "/articles/wohnen/wohnen3.png"
                },
                {
                    "id": "wohnen-4",
                    "title": "Raumakustik verbessern: Tipps für ein ruhiges Zuhause",
                    "subtitle": "Schallschutz und Akustiklösungen für Ihr Heim",
                    "category": "Leben & Wohnen",
                    "imageURL": "/articles/wohnen/wohnen4.png"
                }
            ]
        }
    ]

    return (
        <div className="flex flex-1 bg-gray-100">
            <div className="sticky top-22 hidden h-full bg-gray-100 lg:w-auto xl:block">
                <Categories layout="modern" variables={variables.categories}/>
            </div>
            <main className="block w-full pt-14 lg:mt-6 lg:pt-20 xl:overflow-hidden xl:px-5">
                <div className="border border-border-200">
                    <Banner layout="modern" variables={variables.types}/>
                </div>
                <Element name="grid" className="pt-8">
                    {blogSections.map((blogSection: BlogSection, index) => (
                        <BlogList key={blogSection.id} {...blogSection}/>
                    ))}
                </Element>
            </main>
        </div>
    );
}

function Article(blogPost: BlogPost) {
    return (
        <article className="group isolate grid grid-rows-2 gap-4 relative overflow-hidden rounded bg-dark px-8 pb-8 pt-24 sm:pt-24 lg:pt-24 hover:cursor-pointer">
            <img src={blogPost.imageURL}
                 alt=""
                 className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"/>
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-dark via-dark-200"></div>
            <div className="absolute inset-0 -z-10 rounded ring-1 ring-inset ring-dark-200"></div>
            <h3 className="row-start-2 mt-3 text-xl font-semibold leading-6 text-white">
                <a href="#">
                    <span className="absolute inset-0"></span>
                    {blogPost.title}
                </a>
            </h3>
        </article>
    )
}



function BlogTitle({title, subtitle}: BlogTitleProps) {
    return (
        <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">{subtitle}</p>
        </div>
    )
}

const BlogList: React.FC<BlogSection> = ({id, title, subtitle, blogPosts}) => {
    return (
        <div className="py-12">
            <div className="mx-auto max-w-full ">
                <BlogTitle title={title} subtitle={subtitle}/>
                <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-4">
                    {blogPosts.map((blogPost: BlogPost) => (
                        <Article key={blogPost.id} {...blogPost}/>
                    ))}
                </div>
            </div>
        </div>
    )
}
