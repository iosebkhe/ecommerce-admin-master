import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage() {
  const router = useRouter();
  const prId = router.query.id?.[0];

  const [productInfo, setProductInfo] = useState(null);
  const [categories, setCategories] = useState([]); // Initialize categories state

  useEffect(() => {
    if (prId) {
      axios.get(`/api/products?id=${prId}`).then((response) => {
        const product = response.data.find((product) => product._id === prId);
        setProductInfo(product);

        // Initialize categories state with the product's category IDs
        setCategories(product.categories.map((category) => category._id));
      });
    }
  }, [prId]);

  return (
    <Layout>
      <h1>Edit product</h1>
      {productInfo && <ProductForm {...productInfo} categories={categories} />}
    </Layout>
  );
}

