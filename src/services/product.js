import { api } from './api'

export const getProducts = async (filters) => {
  try {
    const queryParams = [];
    let query = null;

    if (filters) {      
      if (filters.name !== '') {
        queryParams.push(`search=${filters.name}`);
      }
      query = queryParams.join('&');
    }    
    console.log('query:', query);

    const response = (query) ? await api.get(`/products?${query}`) : await api.get('/products');
    return response;
  } catch (error) {
    if (!error.response) {
      return { networkError: 'Erro de conexão.' };
    } else {
      return error.response;
    }
  }
};

export const getProductsPagination = async (page, searchTerm) => {
  try {
    let url = '/products';
    
    if (searchTerm) {
      url += `?search=${encodeURIComponent(searchTerm)}`;
      if (page) {
        url += `&page=${page}&limit=50`;
      }
    } else {
      if (page) {
        url += `?page=${page}&limit=50`;
      }
    }

    console.log(url)
    const response = await api.get(url);
    return response;
  } catch (error) {
    if (!error.response) {
      return { networkError: 'Erro de conexão.' };
    } else {
      return error.response;
    }
  }
};

export const getProduct = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const addProduct = async (user) => {
  try {
    delete user.id;
    const response = await api.post(`/products`, user);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const editProduct = async (product) => {
  try {
    const response = await api.put(`/products/${product.id}`, product);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const deleteProduct = async(id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response;
  } catch(error) {
    return error.response;
  }
}

export const getProductsReport = async (filters) => {
  try {
    const queryParams = [];
    let query = null;

    if (filters) {
      if (filters.initialDate) {
        queryParams.push(`initialDate=${filters.initialDate}`);
      }
      if (filters.finalDate) {
        queryParams.push(`finalDate=${filters.finalDate}`);
      }
      if (filters.product !== '') {
        queryParams.push(`product=${filters.product}`);
      }
      query = queryParams.join('&');
    }
    
    console.log('query:', query);

    const response = (query) ? await api.get(`/reports/products?${query}`) : await api.get('/reports/products');
    return response;
  } catch(error) {
    if (!error.response) {
      return { networkError: 'Erro de conexão.'}
    } else {
      return error.response;
    }
  } 
}
