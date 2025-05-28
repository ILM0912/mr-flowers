import style from './Header.module.css';
import { ReactComponent as LogoIcon } from '../../../src/images/logo.svg';
import { ReactComponent as CartIcon } from '../../../src/images/cart.svg';
import { ReactComponent as ProfileIcon } from '../../../src/images/profile.svg';
import { useSelector } from 'react-redux';

const Header = () => {
	const cartItemsCount = useSelector((state: any) => state.cart.items.length);

	return (
		<header className={style.container}>
			<a href="/" className={style.logo}>
				<LogoIcon />
			</a>
			<nav className={style.actions}>
				<a href="/cart" className={style.actions__icon}>
					<CartIcon />
					{cartItemsCount > 0 && <span className={style.actions__icon__count}>{cartItemsCount<10 ? cartItemsCount : "9+"}</span>}
				</a>
				<a href="/profile" className={style.actions__icon}>
					<ProfileIcon />
				</a>
			</nav>
		</header>
	);
};

export default Header;
