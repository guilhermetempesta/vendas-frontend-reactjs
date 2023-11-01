import { api } from './api'

export const getCustomers = async (filters) => {
  try {
    const queryParams = [];
    let query = null;

    if (filters) {      
      if (filters.name !== '') {
        queryParams.push(`name=${filters.name}`);
      }
      query = queryParams.join('&');
    }    
    console.log('query:', query);
    
    const response = (query) ? await api.get(`/customers?${query}`) : await api.get('/customers');
    console.log(response)
    return response;
  } catch(error) {
    if (!error.response) {
      return { networkError: 'Erro de conexão.'}
    } else {
      return error.response;
    }
  } 
}

export const getCustomer = async (id) => {
  try {
    const response = await api.get(`/customers/${id}`);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const addCustomer = async (customer) => {
  try {
    delete customer.id;
    const response = await api.post(`/customers`, customer);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const editCustomer = async (customer) => {
  try {
    console.log(customer) 
    const response = await api.put(`/customers/${customer.id}`, customer);
    return response;
  } catch(error) {
    return error.response;
  } 
}

export const deleteCustomer = async(id) => {
  try {
    const response = await api.delete(`/customers/${id}`);
    return response;
  } catch(error) {
    return error.response;
  }
}
