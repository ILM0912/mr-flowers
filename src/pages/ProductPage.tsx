import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductInfo from '../components/ProductInfo';
import { DetailedProduct } from '../types';
import { getDetailedProduct } from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { refreshUser } from '../store/AuthSlice';

const ProductPage = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<DetailedProduct | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (!id) return;

        setLoading(true);

        getDetailedProduct(id)
            .then((data) => {
                setProduct(data);
                setLoading(false);
                
                if (user) dispatch(refreshUser(user.email));
            })
            .catch(() => {
                setProduct(null);
                setLoading(false);
            });
    }, [id]);

    return <ProductInfo product={product} loading={loading} />;
};

export default ProductPage;
