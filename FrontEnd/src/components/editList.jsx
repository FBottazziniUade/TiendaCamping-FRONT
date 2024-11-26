import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../Redux/productSlice';
import { fetchImages } from '../Redux/imageSlice';
import '../styles/editlist.css';

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);
  const { items: images } = useSelector((state) => state.images);

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Fetch images for products
  useEffect(() => {
    if (products.length > 0) {
      products.forEach((product) => {
        if (product.imageId && !images[product.imageId]) {
          dispatch(fetchImages(product.imageId));
        }
      });
    }
  }, [products, images, dispatch]);

  // Handle delete
  const handleDelete = (productId) => {
    dispatch(deleteProduct(productId));
  };

  // Handle edit navigation
  const handleEdit = (productId) => {
    navigate(`/edit/${productId}`);
  };

  return (
    <div className="editList">
      <h2>Editar Productos</h2>
      <ul>
        {products.length === 0 ? (
          <li>No hay productos disponibles</li>
        ) : (
          products.map((product) => {
            const imageBase64 = images[product.imageId];

            return (
              <li key={product.id} className="productItem">
                {imageBase64 ? (
                  <img
                    src={`data:image/jpeg;base64,${imageBase64}`}
                    alt={product.description || 'Producto sin descripción'}
                    className="productImage"
                  />
                ) : (
                  <span className="noImage">Imagen no disponible</span>
                )}
                <div className="productDetails">
                  <span className="productDescription">{product.description}</span>
                  <span className="productPrice">Precio: ${product.price.toFixed(2)}</span>
                  <span className="productStock">Stock: {product.stock}</span>
                  <span className="productCategory">
                    Categoría: {product.category.id} - {product.category.name}
                  </span>
                </div>
                <div className="buttonsContainer">
                  <button
                    className="editButton"
                    onClick={() => handleEdit(product.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="deleteButton"
                    onClick={() => handleDelete(product.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default ProductList;
