import {icons} from 'lucide-react';

const Icon = (props) => {
    const LucideIcon = icons[props?.name] ?? icons['Home'];

    return <LucideIcon {...props} />;
};

export default Icon;
