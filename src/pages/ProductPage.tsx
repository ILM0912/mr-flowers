import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductInfo from '../components/ProductInfo';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchDetailedProduct } from '../store/ProductSlice';
import { refreshUser } from '../store/AuthSlice';

const ProductPage = () => {
	const { id } = useParams<{ id: string }>();
	const dispatch = useDispatch<AppDispatch>();
	const { selectedProduct, loading } = useSelector((state: RootState) => state.product);
	const user = useSelector((state: RootState) => state.auth.user);

	useEffect(() => {
		if (!id) return;
		dispatch(fetchDetailedProduct(id));
		if (user) dispatch(refreshUser(user.email));
	}, [id]);

	return <ProductInfo product={selectedProduct} loading={loading} />;
};

export default ProductPage;
