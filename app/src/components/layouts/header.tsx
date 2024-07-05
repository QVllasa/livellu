import Logo from '@/components/ui/logo';
import {useIsHomePage} from '@/lib/use-is-homepage';
import {useState} from 'react';
import {Navigation} from "@/components/layouts/menu/navigation";
import {Button} from "@/shadcn/components/ui/button";
import {Sheet, SheetContent, SheetTrigger} from "@/shadcn/components/ui/sheet";
import {Menu} from "lucide-react"; // Assuming you are using lucide-react icons

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const isHomePage = useIsHomePage();
  const [isSheetOpen, setIsSheetOpen] = useState(false);



  return (
      <header className={' top-0 z-50 w-full lg:h-22'}>
        <div>
          <div className={'flex w-full transform-gpu items-center justify-between bg-light transition-transform duration-300 lg:h-22 lg:px-4 xl:px-8'}>
            <div className="flex w-full shrink-0 grow-0 basis-auto flex-col items-center lg:w-auto lg:flex-row">
              <Logo className={'pt-2 pb-3'}/>
              {/* Mobile Navigation Trigger */}
              <div className="flex items-center lg:hidden absolute left-4 top-2">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className="p-2">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="p-4">
                    <Navigation />
                  </SheetContent>
                </Sheet>
              </div>
            </div>



            {/*{isHomePage ? (*/}
            {/*    <>*/}
            {/*      {(show) && (*/}
            {/*          <div className="mx-auto hidden w-full overflow-hidden px-10 lg:block xl:w-11/12 2xl:w-10/12">*/}
            {/*            <Search label={('text-search-label')} variant="minimal" />*/}
            {/*          </div>*/}
            {/*      )}*/}

            {/*      {displayMobileHeaderSearch && (*/}
            {/*          <div className="absolute top-0 block h-full w-full bg-light px-5 pt-1.5 ltr:left-0 rtl:right-0 md:pt-2 lg:hidden">*/}
            {/*            <Search label={('text-search-label')} variant="minimal" />*/}
            {/*          </div>*/}
            {/*      )}*/}
            {/*    </>*/}
            {/*) : null}*/}

            <ul className="hidden shrink-0 items-center space-x-7 rtl:space-x-reverse lg:flex 2xl:space-x-10">
              <Navigation />
            </ul>


          </div>
          {/*<div*/}
          {/*    className={cn(*/}
          {/*        'w-full border-b border-t border-border-200 bg-light shadow-sm',*/}
          {/*        isHomePage ? 'hidden lg:block' : 'hidden'*/}
          {/*    )}*/}
          {/*>*/}
          {/*</div>*/}
        </div>
      </header>
  );
};

export default Header;
