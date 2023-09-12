import React, { useEffect, useState } from 'react'
import InputField from '../Common/InputField'
import Button from '../Common/Button';
import { useNavigate } from 'react-router';
import { addNewProduct, getSingleProduct, removeProductImage, updateProduct } from '../../API/Products/ProductAPI';
import { VIEWS } from '../../utils/Views';
import { ToastContainer, toast } from 'react-toastify';
import { getAllCategories } from '../../API/Category/CategoryAPI';
import { useLocation } from 'react-router-dom';
import { awsS3UrlGenerate } from '../../utils/Utilities';
import LoadingSpinner from '../Common/LoadingSpinner';


const AddProductAdmin = () => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const productId = searchParams.get("id");
    const [name, setName] = useState("");
    const [color, setColor] = useState("");
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [bearerToken, setBearerToken] = useState("");
    const [categoryList, setCategoryList] = useState([]) as any;
    const [images, setImages] = useState([]) as any;
    const [s3Images, setS3Images] = useState([]) as any;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        const token = localStorage.getItem("accessToken");
        if (token) {
          setBearerToken(token);
        }

        if (productId) {
          handleGetProductDetails(productId);
        }
    }, [productId]);

    useEffect(() => {
        fetchCategories();
    }, [bearerToken]);
    
    const fetchCategories = async () => {
        const getAllCategoriesResponse = await getAllCategories();
        if (getAllCategoriesResponse.success) {
            setCategoryList(getAllCategoriesResponse.data);
        } else {
            console.log("Error:", getAllCategoriesResponse.error);
        }
    };

    const handleGetProductDetails = async (userId: any) => {
      const getProductDetailsResponse = await getSingleProduct({ id: userId });
      if (getProductDetailsResponse .success) {
          const product = getProductDetailsResponse .data;
          setName(product.name);
          setColor(product.color);
          setPrice(product.price);
          setDiscount(product.discount);
          setQuantity(product.quantity);
          setCategory(product.category);
          setDescription(product.description);
          setS3Images(product.image);
      } else {
          console.log("Error:", getProductDetailsResponse.error);
          toast.error(getProductDetailsResponse.error);
      }
    };

    const handleCategoryChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setCategory(e.target.value);
    };


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setImages(files);
    };

    const handleAddProduct = async () => {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('color', color);
      formData.append('price', price.toString());
      formData.append('discount', discount.toString());
      formData.append('quantity', quantity.toString());
      formData.append('description', description);
      formData.append('categoryId', category);
  
      images.forEach((image: string | Blob) => {
        formData.append('files', image);
      });
  
      if(name === ""){
        toast.error("Please enter name..!!");
      } else if(color === ""){
        toast.error("Please enter color..!!");
      } else if(price === null){
        toast.error("Please enter price..!!");
      } else if(discount === null){
        toast.error("Please enter discount..!!");
      } else if(quantity === null){
        toast.error("Please enter quantity..!!");
      } else if(description === ""){
        toast.error("Please enter description..!!");
      } else if(category === ""){
        toast.error("Please select category..!!");
      } else if(images === ""){
        toast.error("Please add Images..!!");
      } else {
        try {
          setIsLoading(true);

          const response = await addNewProduct(formData, bearerToken);

          if (response.success) {
            setIsLoading(false);

            navigate(VIEWS.ADMIN_PRODUCTS);
          } else {
            setIsLoading(false);
            console.error(response.error);
            toast.error(response.error);
          }
        } catch (error) {
          console.log(error);
          setIsLoading(false);
          console.error(error)
        }
      }
      
    };

    const handleUpdateProduct = async () => {

      const formData = new FormData();
      formData.append('name', name);
      formData.append('color', color);
      formData.append('price', price.toString());
      formData.append('discount', discount.toString());
      formData.append('quantity', quantity.toString());
      formData.append('description', description);
      formData.append('categoryId', category);

      images.forEach((image: string | Blob) => {
        formData.append('files', image);
      });

      const payload: any = {
        id: productId
      }

      if(name === ""){
        toast.error("Please enter name..!!");
      } else if(color === ""){
        toast.error("Please enter color..!!");
      } else if(price === null){
        toast.error("Please enter price..!!");
      } else if(discount === null){
        toast.error("Please enter discount..!!");
      } else if(quantity === null){
        toast.error("Please enter quantity..!!");
      } else if(description === ""){
        toast.error("Please enter description..!!");
      } else if(category === ""){
        toast.error("Please select category..!!");
      } else if(images === ""){
        toast.error("Please add Images..!!");
      } else {
        try {
          setIsLoading(true);

          const response = await updateProduct(payload, formData, bearerToken);

          if (response.success) {
              setIsLoading(false);
              toast.success("Product updated successfully");
              navigate(VIEWS.ADMIN_PRODUCTS);
          } else {
              setIsLoading(false);
              toast.error(response.error);
              console.error(response.error)
          }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            console.error(error)
        }
      }

    };

    const handleDeleteImage = async (index: any) => {

      const imageToDelete = s3Images[index];
      console.log(imageToDelete)

        const payload : any = {
            id: productId,
            imageKey: imageToDelete
        };

      const response = await removeProductImage(bearerToken, payload);
  
      if (response.success) {
        console.log(response.data);
        handleGetProductDetails(productId);
        toast.success("Image removed successfully..!!");
      } else {
        console.error(response.error);
        toast.error(response.error);
      }
    };

    const handleSubmit = () => {
      if(productId) {
          handleUpdateProduct()
      } else {
          handleAddProduct()
      }
    }

  return (
    <React.Fragment>
      <div className="mt-24 items-center justify-center w-screen">
        {isLoading ? <LoadingSpinner /> : null}
        <ToastContainer />  
        <h1 className="text-2xl font-bold mb-6 text-center">
              {productId ? "Update Product" : "Add New Product"}
            </h1>
        <div className="w-[600px]  mx-auto bg-white p-8 rounded-md shadow-md mb-10">
          <InputField
            label="Name"
            type="text"
            placeholder="Samsung galaxy S20"
            value={name}
            onChange={setName}
          />
          <InputField
            label="Color"
            type="text"
            placeholder="Sky blue"
            value={color}
            onChange={setColor}
          />
          <InputField
            label="Price (Rs)"
            type="number"
            placeholder="Rs. 355000/-"
            value={price}
            onChange={setPrice}
          />
          <InputField
            label="Discount (%)"
            type="number"
            placeholder="10%"
            value={discount}
            onChange={setDiscount}
          />
          <InputField
            label="Quantity"
            type="number"
            placeholder="20"
            value={quantity}
            onChange={setQuantity}
          />
          <InputField
            label="Description"
            type="text"
            placeholder="Manufactured in 2021"
            value={description}
            onChange={setDescription}
          />
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                Category
            </label>
            <select
                id="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                value={category}
                onChange={handleCategoryChange}
            >
                <option value="">Select a category</option>
                {categoryList.map((category: any) => (
                <option key={category.id} value={category.id}>
                    {category.name}
                </option>
                ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="images"
            >
              Images
            </label>
            <input
              type="file"
              id="images"
              multiple
              onChange={handleImageChange}
            />
          </div>

          {productId && (
            <div className="flex flex-row justify-center items-center mt-5">
            {s3Images.map((item: any, index: any) => (
              <div key={index.toString()} className="relative">
              <img
                className="w-20 h-28 rounded-lg bg-slate-500 m-2 cursor-pointer object-cover object-center shadow-md"
                src={awsS3UrlGenerate(item)}
                alt={`Product Image ${index + 1}`}
              />
              <button
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                onClick={() => handleDeleteImage(index)}
              >
                <i className="fa-solid fa-trash text-[15px] p-0.5" />
              </button>
            </div>
            ))}
          </div>
          )}

          <Button name={productId ? "Update Product" : "Add New Prodduct"} handleAction={handleSubmit} />
        </div>
      </div>
    </React.Fragment>
  )
}

export default AddProductAdmin