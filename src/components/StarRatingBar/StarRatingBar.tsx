import { useState } from 'react';
import { ReactComponent as StarActive } from '../../images/star-active.svg';
import { ReactComponent as Star } from '../../images/star.svg';
import style from './StarRatingBar.module.css';

interface StarRatingBarProps {
    rating: number;
    editable?: boolean;
    onChange?: (value: number) => void;
}

const StarRatingBar = ({ rating, editable = false, onChange }: StarRatingBarProps) => {
    const [hovered, setHovered] = useState<number | null>(null);
    const [selected, setSelected] = useState<number>(rating);

    const handleClick = (value: number) => {
        if (!editable) return;
        setSelected(value);
        if (onChange) onChange(value);
    };

    const displayValue = hovered ?? selected;

    return (
        <div
            className={style.container}
            onMouseLeave={() => editable && setHovered(null)}
        >
            {[1, 2, 3, 4, 5].map(i => {
                const Icon = displayValue >= i ? StarActive : Star;
                return (
                    <span
                        key={i}
                        className={`${style.rating} ${editable ? style.rating_editable : ''}`}
                        onClick={() => handleClick(i)}
                        onMouseEnter={() => editable && setHovered(i)}
                    >
                        <Icon className={style.rating__icon} />
                    </span>
                );
            })}
        </div>
    );
};

export default StarRatingBar;
