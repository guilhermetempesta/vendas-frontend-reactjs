import { api } from './api'

export const getSales = async (filters, filteredCurrentUser) => {
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
      if (filters.customer !== '') {
        queryParams.push(`customer=${filters.customer}`);
      }
      query = queryParams.join('&');
    }
    
    console.log('query:', query);

    let endpoint
    if (filteredCurrentUser) {
      endpoint = '/reports/user-sales'
    } else {
      endpoint = '/sales'
    }

    const response = (query) ? await api.get(`${endpoint}?${query}`) : await api.get(endpoint);
    return response;
  } catch(error) {
    if (!error.response) {
      return { networkError: 'Erro de conexão.'}
    } else {
      return error.response;
    }
  } 
}

export const getSale = async (id) => {
  try {
    const response = await api.get(`/sales/${id}`);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const addSale = async (sale) => {
  try {
    delete sale.id;
    const response = await api.post(`/sales`, sale);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const editSale = async (sale) => {
  try {
    console.log(sale);
    const response = await api.put(`/sales/${sale.id}`, sale);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const deleteSale = async(id) => {
  try {
    const response = await api.delete(`/sales/${id}`);
    return response;
  } catch(error) {
    return error.response;
  }
}

export const getCanceledSales = async (filters) => {
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
      if (filters.user !== '') {
        queryParams.push(`user=${filters.user}`);
      }
      query = queryParams.join('&');
    }
    
    console.log('query:', query);

    const response = (query) 
      ? await api.get(`/reports/canceled-sales?${query}`) 
      : await api.get('/reports/canceled-sales');
    return response;
  } catch(error) {
    if (!error.response) {
      return { networkError: 'Erro de conexão.'}
    } else {
      return error.response;
    }
  } 
}

export const getSalesSummary = async () => {
  try {    
    const response = await api.get('/reports/sales-summary');
    return response;
  } catch(error) {
    if (!error.response) {
      return { networkError: 'Erro de conexão.'}
    } else {
      return error.response;
    }
  } 
}

export const getSalesByDay = async (filters, onlyCurrentUser) => {
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
      query = queryParams.join('&');
    }
    
    console.log('query:', query);

    let response 
    if (onlyCurrentUser) {
      response = await api.get(`/reports/user-sales-by-day?${query}`);
    } else {
      response = await api.get(`/reports/sales-by-day?${query}`);
    }    
    
    return response;
  } catch(error) {
    if (!error.response) {
      return { networkError: 'Erro de conexão.'}
    } else {
      return error.response;
    }
  } 
}

