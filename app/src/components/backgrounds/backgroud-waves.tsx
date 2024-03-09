export const BackgroundWaves = () => {
    return (
        <svg
            className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
            aria-hidden="true"
        >
            <defs>
                <pattern
                    id="wavesPattern"
                    width={200}
                    height={200}
                    x="50%"
                    y={-1}
                    patternUnits="userSpaceOnUse"
                >
                    <path d="M0,100 q50,-50 100,0 q50,50 100,0" stroke="none" fill="none" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wavesPattern)" />
        </svg>
    );
};
