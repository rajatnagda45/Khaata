import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { flushSync } from 'react-dom';
import client from '../api/client';

const InvoiceContext = createContext(null);

const initialState = {
  invoices: [],
  pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
  filters: {
    search: '',
    status: '',
    taxRate: '',
    issueDateFrom: '',
    issueDateTo: '',
    dueDateFrom: '',
    dueDateTo: '',
    sortBy: 'issueDate',
    sortOrder: 'desc'
  },
  customers: [],
  summary: null,
  loading: false,
  error: null
};

function invoiceReducer(state, action) {
  switch (action.type) {
    case 'SET_INVOICES':
      return {
        ...state,
        invoices: action.payload.data,
        pagination: action.payload.pagination,
        error: null
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
    case 'SET_PAGE':
      return {
        ...state,
        pagination: {
          ...state.pagination,
          page: action.payload
        }
      };
    case 'SET_CUSTOMERS':
      return {
        ...state,
        customers: action.payload,
        error: null
      };
    case 'SET_SUMMARY':
      return {
        ...state,
        summary: action.payload,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: initialState.filters,
        pagination: {
          ...state.pagination,
          page: 1
        }
      };
    default:
      return state;
  }
}

export function InvoiceProvider({ children }) {
  const [state, dispatch] = useReducer(invoiceReducer, initialState);

  const setFilters = useCallback((updates, options = { resetPage: true }) => {
    dispatch({ type: 'SET_FILTERS', payload: updates });

    if (options.resetPage !== false) {
      dispatch({ type: 'SET_PAGE', payload: 1 });
    }
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  const setPage = useCallback((page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);

  const fetchInvoices = useCallback(async (params) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const { data } = await client.get('/invoices', { params });
      
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          flushSync(() => {
            dispatch({ type: 'SET_INVOICES', payload: data });
          });
        });
      } else {
        dispatch({ type: 'SET_INVOICES', payload: data });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Unable to load invoices.'
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const fetchCustomers = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const { data } = await client.get('/customers');
      dispatch({ type: 'SET_CUSTOMERS', payload: data });
      return data;
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Unable to load customers.'
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const { data } = await client.get('/invoices/summary');
      dispatch({ type: 'SET_SUMMARY', payload: data });
      return data;
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Unable to load summary.'
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const createInvoice = useCallback(async (payload) => {
    const { data } = await client.post('/invoices', payload);
    return data;
  }, []);

  const updateInvoice = useCallback(async (id, payload) => {
    const { data } = await client.put(`/invoices/${id}`, payload);
    return data;
  }, []);

  const deleteInvoice = useCallback(async (id) => {
    const { data } = await client.delete(`/invoices/${id}`);
    return data;
  }, []);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      setFilters,
      resetFilters,
      setPage,
      fetchInvoices,
      fetchCustomers,
      fetchSummary,
      createInvoice,
      updateInvoice,
      deleteInvoice
    }),
    [
      state,
      setFilters,
      resetFilters,
      setPage,
      fetchInvoices,
      fetchCustomers,
      fetchSummary,
      createInvoice,
      updateInvoice,
      deleteInvoice
    ]
  );

  return <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>;
}

export function useInvoiceContext() {
  const context = useContext(InvoiceContext);

  if (!context) {
    throw new Error('useInvoiceContext must be used within an InvoiceProvider');
  }

  return context;
}
