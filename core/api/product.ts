export type Data = {
  name: string;
  itemid: number;
  item_rating: {
    rating_star: number;
    rating_count: number[];
  };
  shopid: number;
  stock: number;
  sold: number;
  historical_sold: number;
  liked_count: number;
  price: number;
  price_min: number;
  price_max: number;
  price_min_before_discount: number;
  price_max_before_discount: number;
  price_before_discount: number;
  discount: string;
  raw_discount: number;
  shop_location: string;
  flash_sale_stock: number;
  is_service_by_shopee: boolean;
  is_on_flash_sale: false;
};

export const getHintSearch = async (query: string) => {
  const baseUrl = `https://shopee.co.id/api/v4/search/search_user?keyword=${query}&limit=5&offset=0&page=search_user&with_search_cover=true`;
  const response = await fetch(baseUrl);
  const result = await response.json();

  return result.data.users;
};

export const getProducts = async (shopee_id: number) => {
  const baseUrl = `https://shopee.co.id/api/v4/recommend/recommend?bundle=shop_page_category_tab_main&item_card=2&limit=100&offset=0&section=shop_page_category_tab_main_sec&shopid=${shopee_id}&sort_type=1&tab_name=popular&upstream=pdp`;
  const response = await fetch(baseUrl);
  const result = await response.json();

  return result;
};

export const getUrlImage = (resourceId: string) => {
  const baseUrl = `https://cf.shopee.co.id/file/${resourceId}`;
  return baseUrl;
};
