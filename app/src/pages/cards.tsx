import DashboardLayout from '@/layouts/_dashboard';

// export { getStaticProps } from '@/framework/general.ssr';

const FeatureNotAvailable = () => {
  return (
    <div className="payment-modal relative h-full w-screen max-w-md overflow-hidden rounded-[10px] bg-light md:h-auto md:min-h-0 lg:max-w-[46rem]">
      <div className="p-6 lg:p-12">
        <span className="mb-2 block text-sm font-semibold text-black">
          Sorry this feature is not available!
        </span>
      </div>
    </div>
  );
};

const MyCardsPage = () => {
  // const { settings } = useSettings();
  //
  // // validation check from front-end
  // const isStripeGatewayAvailable = isStripeAvailable(settings);
  // if (!isStripeGatewayAvailable) {
  //   return <FeatureNotAvailable />;
  // }

  return (
    <>
      {/*<Seo noindex={true} nofollow={true} />*/}
      {/*<Card className="shadow-n relative w-full self-stretch overflow-hidden md:p-16 md:pt-12">*/}

      {/*</Card>*/}
    </>
  );
};

MyCardsPage.authenticationRequired = true;

MyCardsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default MyCardsPage;
