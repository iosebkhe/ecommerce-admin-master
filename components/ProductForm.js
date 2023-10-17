import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  shortDescription: existingShortDescription,
  fullDescription: existingFullDescription,
  categories: assignedCategories,
  cardImage: existingCardImage,
  images: existingImages,
  country: existingCountry,
  size: existingSize,
  usage: existingUsage,
  purpose: existingPurpose,
  material: existingMaterial,
  yearCreated: existingYearCreated,
  price: existingPrice,
  discountedPrice: existingDiscountedPrice,
  hasDiscount: existingHasDiscount
}) {
  // const assignedCategoryIds = assignedCategories.map(category => category._id);

  const [title, setTitle] = useState(existingTitle || '');
  const [shortDescription, setShortDescription] = useState(existingShortDescription || "");
  const [fullDescription, setFullDescription] = useState(existingFullDescription || "");
  const [categories, setCategories] = useState(assignedCategories || []);
  const [cardImage, setCardImage] = useState(existingCardImage || "");
  const [images, setImages] = useState(existingImages || []);
  const [country, setCountry] = useState(existingCountry || "");
  const [size, setSize] = useState(existingSize || "");
  const [usage, setUsage] = useState(existingUsage || "");
  const [purpose, setPurpose] = useState(existingPurpose || "");
  const [material, setMaterial] = useState(existingMaterial || "");
  const [yearCreated, setYearCreated] = useState(existingYearCreated || "");
  const [price, setPrice] = useState(existingPrice || '');
  const [discountedPrice, setDiscountedPrice] = useState(existingDiscountedPrice || null);
  const [hasDiscount, setHasDiscount] = useState(existingHasDiscount || false);

  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCardImageUploading, setIsCardImageUploading] = useState(false);
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setFetchedCategories(result.data);
    });
  }, []);

  const handleCategoryChange = (categoryId) => {
    if (categories.includes(categoryId)) {
      // Category is already selected, so remove it
      setCategories((prevCategories) =>
        prevCategories.filter((id) => id !== categoryId)
      );
    } else {
      // Category is not selected, so add it
      setCategories([...categories, categoryId]);
    }
  };




  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      shortDescription,
      fullDescription,
      categories,
      cardImage,
      images,
      country,
      size,
      usage,
      purpose,
      material,
      yearCreated,
      price,
      discountedPrice,
      hasDiscount
    };
    if (_id) {
      //update
      await axios.put('/api/products', { ...data, _id });
    } else {
      //create
      await axios.post('/api/products', data);
    }

    setGoToProducts(true);
  }

  if (goToProducts) {
    router.push('/products');
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      const res = await axios.post('/api/upload', data);
      setImages(oldImages => {
        return [...oldImages, ...res.data.links];
      });
      setCardImage(oldCardImages => {
        return [...oldCardImages, ...res.data.links][0];
      });
      setIsUploading(false);
      setIsCardImageUploading(false);
    }
  }


  function updateImagesOrder(images) {
    setImages(images);
  }

  return (
    <form onSubmit={saveProduct}>
      <label className="mb-3 inline-block">პროდუქტის სახელი</label>
      <input
        type="text"
        placeholder="პროდუქტის სახელი"
        value={title}
        onChange={ev => setTitle(ev.target.value)} />

      <label className="my-3 inline-block">კატეგორიები</label>
      <div className="grid grid-cols-4 gap-2 p-3 shadow-lg max-h-32 overflow-auto mb-5">
        {fetchedCategories.map((category) => (
          <div key={category._id}>
            <label className="flex items-center gap-1 text-base">
              {category.name}
              <input
                className="w-auto p-0 m-0"
                type="checkbox"
                value={category._id}
                checked={categories.includes(category._id)}
                onChange={(ev) => handleCategoryChange(ev.target.value)}
              />
            </label>
          </div>
        ))}
      </div>

      <label className="mb-3 inline-block">
        მთავარი ფოტო
      </label>
      <div className="mb-2 flex flex-wrap gap-1">
        {images.length > 0 &&
          <div key={images[0]} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
            <img src={images[0]} alt="" className="rounded-lg" />
          </div>}
        {isCardImageUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        {images.length > 0 ? "" : <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <div>
            ატვირთვა
          </div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>}
      </div>

      <label className="mb-3 inline-block">
        გალერიის ფოტოები
      </label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}>
          {!!images?.length && images.map(link => (
            <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
              <img src={link} alt="" className="rounded-lg" />
            </div>
          ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <div>
            ატვირთვა
          </div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-x-2">

        <div>
          <label className="mb-3 inline-block">ფასი</label>
          <input
            type="number"
            placeholder="ფასი"
            value={price}
            onChange={ev => setPrice(ev.target.value)}
          />
        </div>

        <div>

          <label className="mb-3 inline-block">ქვეყანა</label>
          <input
            placeholder="ქვეყანა"
            value={country}
            onChange={ev => setCountry(ev.target.value)}
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div>
            <label className="mr-2">ფასდაკლება</label>
            <input
              className="w-auto m-0 p-0"
              type="checkbox"
              checked={hasDiscount}
              onChange={ev => setHasDiscount(ev.target.checked)}
            />
          </div>


          {hasDiscount &&
            <div>
              <label className="mb-3 inline-block">ფასდაკლებული ფასი</label>
              <input
                type="number"
                placeholder="ფასდაკლებული ფასი"
                value={discountedPrice}
                onChange={ev => setDiscountedPrice(ev.target.value)}
              />
            </div>
          }
        </div>


        <div>
          <label className="mb-3 inline-block">ზომები</label>
          <input
            placeholder="ზომები"
            value={size}
            onChange={ev => setSize(ev.target.value)}
          />
        </div>

        <div>
          <label className="mb-3 inline-block">მოკლე აღწერა</label>
          <textarea
            placeholder="მოკლე აღწერა"
            value={shortDescription}
            onChange={ev => setShortDescription(ev.target.value)}
          />
        </div>

        <div>
          <label className="mb-3 inline-block">სრული აღწერა</label>
          <textarea
            placeholder="სრული აღწერა"
            value={fullDescription}
            onChange={ev => setFullDescription(ev.target.value)}
          />
        </div>

        <div>
          <label className="mb-3 inline-block">გამოყენება</label>
          <input
            placeholder="გამოყენება"
            value={usage}
            onChange={ev => setUsage(ev.target.value)}
          />
        </div>

        <div>
          <label className="mb-3 inline-block">დანიშნულება</label>
          <input
            placeholder="დანიშნულება"
            value={purpose}
            onChange={ev => setPurpose(ev.target.value)}
          />
        </div>

        <div>

          <label className="mb-3 inline-block">მასალა</label>
          <input
            placeholder="მასალა"
            value={material}
            onChange={ev => setMaterial(ev.target.value)}
          />
        </div>

        <div>

          <label className="mb-3 inline-block">დამზადების წელი</label>
          <input
            placeholder="დამზადების წელი"
            value={yearCreated}
            onChange={ev => setYearCreated(ev.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn-primary">
        პროდუქტის დამატება
      </button>
    </form >
  );
}
