import type {
    ApiResponse,
    Article, ArticleCategory,
    Attachment,
    Author,
    AuthorPaginator,
    AuthorQueryOptions,
    AuthResponse,
    BestSellingProductQueryOptions, Brand,
    Card, Category,
    CategoryPaginator,
    CategoryQueryOptions,
    ChangePasswordUserInput,
    CheckoutVerificationInput, Color,
    CouponPaginator,
    CouponQueryOptions,
    CreateAbuseReportInput,
    CreateContactUsInput,
    CreateFeedbackInput,
    CreateOrderInput,
    CreateOrderPaymentInput,
    CreateQuestionInput,
    CreateRefundInput,
    CreateReviewInput,
    DownloadableFilePaginator,
    EmailChangeResponse,
    Feedback,
    ForgotPasswordUserInput,
    GetParams,
    LoginUserInput,
    Manufacturer,
    ManufacturerPaginator,
    ManufacturerQueryOptions, Material, Merchant,
    MyQuestionQueryOptions,
    MyReportsQueryOptions,
    Navigation,
    Order,
    OrderPaginator,
    OrderQueryOptions,
    OtpLoginInputType,
    OTPResponse,
    PasswordChangeResponse, Path,
    PaymentIntentCollection,
    PopularProductQueryOptions,
    Product,
    ProductPaginator,
    ProductQueryOptions,
    QueryOptions,
    QuestionPaginator,
    QuestionQueryOptions,
    Refund,
    RefundPaginator,
    RegisterUserInput,
    ResetPasswordUserInput,
    Review,
    ReviewPaginator,
    ReviewQueryOptions,
    ReviewResponse,
    SendOtpCodeInputType,
    Settings,
    SettingsQueryOptions,
    Shop,
    ShopMapLocation,
    ShopPaginator,
    ShopQueryOptions,
    SocialLoginInputType,
    StoreNoticePaginator,
    StoreNoticeQueryOptions,
    TagPaginator,
    TagQueryOptions,
    Type,
    TypeQueryOptions,
    UpdateEmailUserInput,
    UpdateReviewInput,
    UpdateUserInput,
    User,
    VerificationEmailUserInput,
    VerifiedCheckoutData,
    VerifyCouponInputType,
    VerifyCouponResponse,
    VerifyForgotPasswordUserInput,
    VerifyOtpInputType,
    Wishlist,
    WishlistPaginator,
    WishlistQueryOptions,
} from '@/types';
//@ts-ignore
import {OTPVerifyResponse} from '@/types';
import {API_ENDPOINTS} from './api-endpoints';
import {HttpClient} from './http-client';
// @ts-ignore
import * as qs from 'qs';

class Client {
    myQuestions = {
        all: (params: MyQuestionQueryOptions) =>
            HttpClient.get<QuestionPaginator>(API_ENDPOINTS.MY_QUESTIONS, {
                with: 'user',
                orderBy: 'created_at',
                sortedBy: 'desc',
                ...params,
            }),
    };
    myReports = {
        all: (params: MyReportsQueryOptions) =>
            HttpClient.get<QuestionPaginator>(API_ENDPOINTS.MY_REPORTS, {
                with: 'user',
                orderBy: 'created_at',
                sortedBy: 'desc',
                ...params,
            }),
    };
    reviews = {
        all: ({rating, ...params}: ReviewQueryOptions) =>
            HttpClient.get<ReviewPaginator>(API_ENDPOINTS.PRODUCTS_REVIEWS, {
                searchJoin: 'and',
                with: 'user',
                ...params,

            }),
        get: ({id}: { id: string }) =>
            HttpClient.get<Review>(`${API_ENDPOINTS.PRODUCTS_REVIEWS}/${id}`),
        create: (input: CreateReviewInput) =>
            HttpClient.post<ReviewResponse>(API_ENDPOINTS.PRODUCTS_REVIEWS, input),
        update: (input: UpdateReviewInput) =>
            HttpClient.put<ReviewResponse>(
                `${API_ENDPOINTS.PRODUCTS_REVIEWS}/${input.id}`,
                input
            ),
    };
    tags = {
        all: (params: Partial<TagQueryOptions>) =>
            HttpClient.get<TagPaginator>(API_ENDPOINTS.TAGS, params),
    };
    types = {
        all: (params?: Partial<TypeQueryOptions>) =>
            HttpClient.get<Type[]>(API_ENDPOINTS.TYPES, params),
        get: ({slug, language}: { slug: string; language: string }) =>
            HttpClient.get<Type>(`${API_ENDPOINTS.TYPES}/${slug}`, {language}),
    };
    shops = {
        all: (params: Partial<ShopQueryOptions>) =>
            HttpClient.get<ShopPaginator>(API_ENDPOINTS.SHOPS, {

                ...params,
            }),
        get: (slug: string) =>
            HttpClient.get<Shop>(`${API_ENDPOINTS.SHOPS}/${slug}`),

        searchNearShops: (input: ShopMapLocation) =>
            HttpClient.get<any>(API_ENDPOINTS.NEAR_SHOPS, input),

        getSearchNearShops: ({lat, lng}: ShopMapLocation) =>
            HttpClient.get<any>(`${API_ENDPOINTS.NEAR_SHOPS}/${lat}/${lng}`),
    };


    manufacturers = {
        all: ({name, ...params}: Partial<ManufacturerQueryOptions>) =>
            HttpClient.get<ManufacturerPaginator>(API_ENDPOINTS.MANUFACTURERS, {
                ...params,

            }),
        top: (params: Pick<QueryOptions, 'limit'>) =>
            HttpClient.get<Manufacturer[]>(API_ENDPOINTS.MANUFACTURERS_TOP, params),
        get: ({slug, language}: { slug: string; language?: string }) =>
            HttpClient.get<Manufacturer>(`${API_ENDPOINTS.MANUFACTURERS}/${slug}`, {
                language,
            }),
    };
    coupons = {
        all: (params: Partial<CouponQueryOptions>) =>
            HttpClient.get<CouponPaginator>(API_ENDPOINTS.COUPONS, params),
        verify: (input: VerifyCouponInputType) =>
            HttpClient.post<VerifyCouponResponse>(
                API_ENDPOINTS.COUPONS_VERIFY,
                input
            ),
    };
    orders = {
        all: (params: Partial<OrderQueryOptions>) =>
            HttpClient.get<OrderPaginator>(API_ENDPOINTS.ORDERS, {
                with: 'refund',
                ...params,
            }),
        get: (tracking_number: string) =>
            HttpClient.get<Order>(`${API_ENDPOINTS.ORDERS}/${tracking_number}`),
        create: (input: CreateOrderInput) =>
            HttpClient.post<Order>(API_ENDPOINTS.ORDERS, input),
        refunds: (params: Pick<QueryOptions, 'limit'>) =>
            HttpClient.get<RefundPaginator>(API_ENDPOINTS.ORDERS_REFUNDS, params),
        createRefund: (input: CreateRefundInput) =>
            HttpClient.post<Refund>(API_ENDPOINTS.ORDERS_REFUNDS, input),
        payment: (input: CreateOrderPaymentInput) =>
            HttpClient.post<any>(API_ENDPOINTS.ORDERS_PAYMENT, input),
        savePaymentMethod: (input: any) =>
            HttpClient.post<any>(API_ENDPOINTS.SAVE_PAYMENT_METHOD, input),

        downloadable: (query?: OrderQueryOptions) =>
            HttpClient.get<DownloadableFilePaginator>(
                API_ENDPOINTS.ORDERS_DOWNLOADS,
                query
            ),
        verify: (input: CheckoutVerificationInput) =>
            HttpClient.post<VerifiedCheckoutData>(
                API_ENDPOINTS.ORDERS_CHECKOUT_VERIFY,
                input
            ),
        generateDownloadLink: (input: { digital_file_id: string }) =>
            HttpClient.post<string>(
                API_ENDPOINTS.GENERATE_DOWNLOADABLE_PRODUCT_LINK,
                input
            ),
        getPaymentIntentOriginal: ({
                                       tracking_number,
                                   }: {
            tracking_number: string;
        }) =>
            HttpClient.get<PaymentIntentCollection>(API_ENDPOINTS.PAYMENT_INTENT, {
                tracking_number,
            }),
        getPaymentIntent: ({
                               tracking_number,
                               payment_gateway,
                               recall_gateway,
                           }: {
            tracking_number: string;
            payment_gateway?: string;
            recall_gateway?: boolean;
        }) =>
            HttpClient.get<PaymentIntentCollection>(API_ENDPOINTS.PAYMENT_INTENT, {
                tracking_number,
                payment_gateway,
                recall_gateway,
            }),
    };
    users = {
        me: () => HttpClient.get<User>(API_ENDPOINTS.USERS_ME),
        update: (user: UpdateUserInput) =>
            HttpClient.put<User>(`${API_ENDPOINTS.USERS}/${user.id}`, user),
        login: (input: LoginUserInput) =>
            HttpClient.post<AuthResponse>(API_ENDPOINTS.USERS_LOGIN, input),
        socialLogin: (input: SocialLoginInputType) =>
            HttpClient.post<AuthResponse>(API_ENDPOINTS.SOCIAL_LOGIN, input),
        sendOtpCode: (input: SendOtpCodeInputType) =>
            HttpClient.post<OTPResponse>(API_ENDPOINTS.SEND_OTP_CODE, input),
        verifyOtpCode: (input: VerifyOtpInputType) =>
            HttpClient.post<OTPVerifyResponse>(API_ENDPOINTS.VERIFY_OTP_CODE, input),
        OtpLogin: (input: OtpLoginInputType) =>
            HttpClient.post<AuthResponse>(API_ENDPOINTS.OTP_LOGIN, input),
        register: (input: RegisterUserInput) =>
            HttpClient.post<AuthResponse>(API_ENDPOINTS.USERS_REGISTER, input),
        forgotPassword: (input: ForgotPasswordUserInput) =>
            HttpClient.post<PasswordChangeResponse>(
                API_ENDPOINTS.USERS_FORGOT_PASSWORD,
                input
            ),
        verifyForgotPasswordToken: (input: VerifyForgotPasswordUserInput) =>
            HttpClient.post<PasswordChangeResponse>(
                API_ENDPOINTS.USERS_VERIFY_FORGOT_PASSWORD_TOKEN,
                input
            ),
        resetPassword: (input: ResetPasswordUserInput) =>
            HttpClient.post<PasswordChangeResponse>(
                API_ENDPOINTS.USERS_RESET_PASSWORD,
                input
            ),
        changePassword: (input: ChangePasswordUserInput) =>
            HttpClient.post<PasswordChangeResponse>(
                API_ENDPOINTS.USERS_CHANGE_PASSWORD,
                input
            ),
        updateEmail: (input: UpdateEmailUserInput) =>
            HttpClient.post<EmailChangeResponse>(
                API_ENDPOINTS.USERS_UPDATE_EMAIL,
                input
            ),
        logout: () => HttpClient.post<boolean>(API_ENDPOINTS.USERS_LOGOUT, {}),
        deleteAddress: ({id}: { id: string }) =>
            HttpClient.delete<boolean>(`${API_ENDPOINTS.USERS_ADDRESS}/${id}`),
        subscribe: (input: { email: string }) =>
            HttpClient.post<any>(API_ENDPOINTS.USERS_SUBSCRIBE_TO_NEWSLETTER, input),
        contactUs: (input: CreateContactUsInput) =>
            HttpClient.post<any>(API_ENDPOINTS.USERS_CONTACT_US, input),
        resendVerificationEmail: () => {
            return HttpClient.post<VerificationEmailUserInput>(
                API_ENDPOINTS.SEND_VERIFICATION_EMAIL,
                {}
            );
        },
    };
    wishlist = {
        all: (params: WishlistQueryOptions) =>
            HttpClient.get<WishlistPaginator>(API_ENDPOINTS.USERS_WISHLIST, {
                with: 'shop',
                orderBy: 'created_at',
                sortedBy: 'desc',
                ...params,
            }),
        toggle: (input: { product_id: string; language?: string }) =>
            HttpClient.post<{ in_wishlist: boolean }>(
                API_ENDPOINTS.USERS_WISHLIST_TOGGLE,
                input
            ),
        remove: (id: string) =>
            HttpClient.delete<Wishlist>(`${API_ENDPOINTS.WISHLIST}/${id}`),
        checkIsInWishlist: ({product_id}: { product_id: string }) =>
            HttpClient.get<boolean>(
                `${API_ENDPOINTS.WISHLIST}/in_wishlist/${product_id}`
            ),
    };
    settings = {
        all: (params?: SettingsQueryOptions) =>
            HttpClient.get<Settings>(API_ENDPOINTS.SETTINGS, {...params}),
        upload: (input: File[]) => {
            let formData = new FormData();
            input.forEach((attachment) => {
                formData.append('attachment[]', attachment);
            });
            return HttpClient.post<Attachment[]>(API_ENDPOINTS.UPLOADS, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        },
    };
    cards = {
        all: (params?: any) =>
            HttpClient.get<Card[]>(API_ENDPOINTS.CARDS, {...params}),
        remove: ({id}: { id: string }) =>
            HttpClient.delete<any>(`${API_ENDPOINTS.CARDS}/${id}`),
        addPaymentMethod: (method_key: any) =>
            HttpClient.post<any>(API_ENDPOINTS.CARDS, method_key),
        makeDefaultPaymentMethod: (input: any) =>
            HttpClient.post<any>(API_ENDPOINTS.SET_DEFAULT_CARD, input),
    };


    articles = {
        all: (params?: any) => HttpClient.get<Article>(API_ENDPOINTS.ARTICLES, {...params}),
        get: (params: any) => {
            return HttpClient.get<Article>(`${API_ENDPOINTS.ARTICLES}`, params)
        }
    }
    navigation = {
        all: (params?: any) => HttpClient.get<Navigation>(API_ENDPOINTS.NAVIGATIONS, {...params})
    }
    products = {
        get: (params: any) => {
            return HttpClient.get<Product>(`${API_ENDPOINTS.PRODUCTS}`, params)
        },
        getMinMaxPrice: () => {
            return HttpClient.get<{min: number, max: number}>(`${API_ENDPOINTS.PRODUCTS}/min-max-price`)
        }
    };
    articlesCategories = {
        all: (params?: any) => HttpClient.get<ArticleCategory>(API_ENDPOINTS.ARTICLE_CATEGORIES, {...params}),
        get: (params: any) => {
            return HttpClient.get<ArticleCategory>(`${API_ENDPOINTS.ARTICLE_CATEGORIES}`, params)
        }
    };
    categories = {
        get: (params: any) => {
            return HttpClient.get<Category>(`${API_ENDPOINTS.CATEGORIES}`, params)
        }
    }
    colors = {
        get: (params: any) => {
            return HttpClient.get<Color>(`${API_ENDPOINTS.COLOR}`, params)
        }
    }
    materials = {
        all: (params?: any) => HttpClient.get<Material>(API_ENDPOINTS.MATERIAL, {...params}),
        get: (params: any) => {
            return HttpClient.get<Material>(`${API_ENDPOINTS.MATERIAL}`, params)
        }
    }
    brands = {
        get: (params: any) => {
            return HttpClient.get<Brand>(`${API_ENDPOINTS.BRAND}`, params)
        }
    }

    paths = {
        all: (params?: any) => HttpClient.get<Path>(API_ENDPOINTS.PATHS, {...params}),
        get: (params: any) => {
            return HttpClient.get<Path>(`${API_ENDPOINTS.PATHS}`, params)
        }
    }
    merchants = {
        all: (params?: any) => HttpClient.get<Merchant>(API_ENDPOINTS.MERCHANTS, params),
        get: (params: any) => {
            return HttpClient.get<Merchant>(`${API_ENDPOINTS.MERCHANTS}`, params)
        }
    };

}

export default new Client();



