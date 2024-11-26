import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../Redux/productSlice";
import { createImage } from "../../Redux/imageSlice";
import { fetchCategories } from "../../Redux/categorySlice";
import "../../styles/form.css";

const Form = () => {
  const [product, setProduct] = useState({
    description: "",
    categoryId: "",
    stock: "",
    price: "",
    imageId: null, // Initially no image
  });

  const [imageFile, setImageFile] = useState(null); // Selected image file
  const hiddenFileInput = useRef(null); // File input reference
  const dispatch = useDispatch();
  
  const categories = useSelector((state) => state.categories.categories); // Get categories from the store
  const loadingCategories = useSelector((state) => state.categories.loading);
  const categoryError = useSelector((state) => state.categories.error);

  // Fetch categories when the component mounts
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file); // Save the uploaded image file
  };

  // Handle file input click
  const handleFileClick = () => {
    hiddenFileInput.current.click(); // Open the file input dialog
  };

  // Handle image upload and product creation
  const handleUploadImage = async () => {
    if (!imageFile) {
      alert("Por favor selecciona una imagen");
      return;
    }
  
    try {
      // Dispatch the image upload action
      const uploadedImage = await dispatch(createImage(imageFile));
      
      if (uploadedImage.payload) {
        // Get the image ID from the response
        const imageId = uploadedImage.payload; // imageId is returned in the payload
  
        // Create the product with the imageId
        const newProduct = { ...product, imageId };
        console.log('addProduct: ', newProduct)
  
        // Dispatch the action to create the product
        dispatch(createProduct(newProduct));
  
        // Reset form fields
        setProduct({
          description: "",
          categoryId: "",
          stock: "",
          price: "",
          imageId: null,
        });
      } else {
        console.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error while creating product or uploading image:", error.message);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <h1>Agregar Producto</h1>

      <label>Nombre del Producto</label>
      <input
        type="text"
        name="description"
        value={product.description}
        onChange={handleChange}
      />

      <label>Categoría</label>
      {loadingCategories ? (
        <p>Cargando categorías...</p>
      ) : categoryError ? (
        <p>Error al cargar categorías: {categoryError}</p>
      ) : (
        <select
          name="categoryId"
          value={product.categoryId}
          onChange={handleChange}
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.description}
            </option>
          ))}
        </select>
      )}

      <label>Stock</label>
      <input
        type="number"
        name="stock"
        value={product.stock}
        onChange={handleChange}
      />

      <label>Precio</label>
      <input
        type="number"
        name="price"
        value={product.price}
        onChange={handleChange}
      />

      <label>Imagen</label>
      <div onClick={handleFileClick} style={{ cursor: "pointer" }}>
        <input
          type="file"
          ref={hiddenFileInput}
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        <button type="button">
          {imageFile ? imageFile.name : "Subir imagen"}
        </button>
      </div>

      <button type="button" onClick={handleUploadImage}>
        Agregar Producto
      </button>
    </form>
  );
};

export default Form;
