import { useState, useEffect } from 'react';
import { useProductContext } from '@src/context/product-context';
import { useSiteContext } from '@src/context/site-context';
import { BundleProductWithState } from './types';
import BundleProductItem from './bundle-product-item';
import BundleProductSidebar from './bundle-product-sidebar';
import { Content } from '@src/components/blocks/content';

export const ProductBundlePage = () => {
  const { product, bundle, actions } = useProductContext();
  const { currentCurrency } = useSiteContext();
  const [, setSelectedBundle] = bundle.selected;
  const [products, setProducts] = useState<BundleProductWithState[]>([]);
  const [total, setTotal] = useState(0);

  // Initialize products from bundle data
  useEffect(() => {
    if (!product) return;

    if (product.bundle && product.bundle.products) {
      const initialProducts = product.bundle.products.map(
        (item) =>
          ({
            id: item.product.id,
            bundleId: item.product.bundleId,
            name: item.product.name || '',
            image: item.product.image || '',
            price: item.product.price || { GBP: 0 },
            stockStatus: item.product.stockStatus || 'instock',
            quantity: 0,
            selected: false,
            settings: {
              discountPercent: item.settings.discountPercent,
              showDiscountedPrice: item.settings.showDiscountedPrice || false,
              pricedIndividually: item.settings.pricedIndividually || false,
            },
          } as BundleProductWithState)
      );
      setProducts(initialProducts);
    }
  }, [product]);

  // Calculate total price whenever products change
  useEffect(() => {
    const newTotal = products.reduce((sum, prod) => {
      if (prod.selected && prod.quantity > 0) {
        let price = Number(prod.price[currentCurrency] || 0);

        // Apply discount if applicable
        if (prod.settings.discountPercent) {
          const discountMultiplier = (100 - prod.settings.discountPercent) / 100;
          price = price * discountMultiplier;
        }

        return sum + price * prod.quantity;
      }
      return sum;
    }, 0);
    setTotal(newTotal);

    // Update the selected bundle in context
    const selectedProducts = products
      .filter((p) => p.selected && p.quantity > 0)
      .reduce((obj: Record<string, { id: number; quantity: number; price: number }>, item) => {
        let price = Number(item.price[currentCurrency]) || 0;

        // Apply discount if applicable
        if (item.settings.discountPercent) {
          const discountMultiplier = (100 - item.settings.discountPercent) / 100;
          price = price * discountMultiplier;
        }

        obj[item.bundleId.toString()] = {
          id: item.id,
          quantity: item.quantity,
          price: price,
        };
        return obj;
      }, {});

    setSelectedBundle(selectedProducts);
  }, [products, currentCurrency, setSelectedBundle]);

  // Toggle product selection
  const toggleProductSelection = (id: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((prod) =>
        prod.id === id
          ? { ...prod, selected: !prod.selected, quantity: prod.selected ? 0 : 1 }
          : prod
      )
    );
  };

  // Update product quantity
  const updateQuantity = (id: number, qty: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        if (prod.id === id) {
          const newQty = Math.max(0, qty);
          // If quantity is 0 or less, set selected to false (remove from selection)
          return {
            ...prod,
            quantity: newQty,
            selected: newQty > 0 ? prod.selected : false,
          };
        }
        return prod;
      })
    );
  };

  // Handle add to basket
  const handleAddToBasket = () => {
    // Use the product context's addToCart function
    // The product context will automatically use the bundle add to cart function for bundle products
    actions
      .addToCart()
      .then(() => {
        // Reset selected products after successful add to cart
        setProducts((prevProducts) =>
          prevProducts.map((prod) => ({
            ...prod,
            selected: false,
            quantity: 0,
          }))
        );
      })
      .catch(() => {
        // Handle error silently - the error will be shown by the product context
      });
  };

  if (!product) {
    return null;
  }

  if (!product.hasBundle) {
    return <div>This product is not a bundle product.</div>;
  }

  return (
    <>
      {product.description && (
        <div className="bundle-product-description">
          <Content content={product.description} />
        </div>
      )}

      <div className="bundle-product-container font-primary">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 xl:gap-16 flex-grow">
            {products.map((product) => (
              <BundleProductItem
                key={product.id}
                product={product}
                currency={currentCurrency}
                onToggleSelection={toggleProductSelection}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </div>
          <BundleProductSidebar
            total={total}
            currency={currentCurrency}
            onAddToBasket={handleAddToBasket}
            products={products}
          />
        </div>
      </div>
    </>
  );
};
