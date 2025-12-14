import api from '../lib/api';

/**
 * Sweets Service
 * Handles sweet management API calls
 */

export interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSweetData {
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface UpdateSweetData {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
}

export interface PurchaseSweetData {
  quantity: number;
}

export interface QuerySweetsParams {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const sweetsService = {
  /**
   * Get all sweets with optional filters
   */
  getAll: async (params?: QuerySweetsParams): Promise<Sweet[]> => {
    const response = await api.get('/sweets', { params });
    return response.data;
  },

  /**
   * Get a sweet by ID
   */
  getById: async (id: number): Promise<Sweet> => {
    const response = await api.get(`/sweets/${id}`);
    return response.data;
  },

  /**
   * Create a new sweet (Admin only)
   */
  create: async (data: CreateSweetData): Promise<Sweet> => {
    const response = await api.post('/sweets', data);
    return response.data;
  },

  /**
   * Update a sweet (Admin only)
   */
  update: async (id: number, data: UpdateSweetData): Promise<Sweet> => {
    const response = await api.patch(`/sweets/${id}`, data);
    return response.data;
  },

  /**
   * Delete a sweet (Admin only)
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/sweets/${id}`);
  },

  /**
   * Purchase a sweet
   */
  purchase: async (id: number, data: PurchaseSweetData): Promise<Sweet> => {
    const response = await api.post(`/sweets/${id}/purchase`, data);
    return response.data;
  },

  /**
   * Restock a sweet (Admin only)
   */
  restock: async (id: number, quantity: number): Promise<Sweet> => {
    const response = await api.post(`/sweets/${id}/restock`, { quantity });
    return response.data;
  },
};


