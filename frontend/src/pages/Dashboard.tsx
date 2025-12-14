import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { sweetsService, Sweet, QuerySweetsParams } from '../services/sweets.service';
import toast from 'react-hot-toast';

/**
 * Dashboard Page
 * Displays all sweets with search and filter functionality
 * Allows users to purchase sweets
 */
const Dashboard = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useState<QuerySweetsParams>({});
  const [purchaseQuantity, setPurchaseQuantity] = useState<{ [key: number]: number }>({});

  // Fetch sweets with filters
  const { data: sweets = [], isLoading } = useQuery({
    queryKey: ['sweets', searchParams],
    queryFn: () => sweetsService.getAll(searchParams),
  });

  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      sweetsService.purchase(id, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      toast.success('Purchase successful!');
      setPurchaseQuantity({});
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Purchase failed');
    },
  });

  const handlePurchase = (sweet: Sweet) => {
    const quantity = purchaseQuantity[sweet.id] || 1;
    if (quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    purchaseMutation.mutate({ id: sweet.id, quantity });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by query params, so we just need to trigger refetch
    queryClient.invalidateQueries({ queryKey: ['sweets'] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">SweetFlow</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
            {user?.role === 'ADMIN' && (
              <a
                href="/admin"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Admin Dashboard
              </a>
            )}
            <button
              onClick={logout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Search & Filter</h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Search by name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={searchParams.name || ''}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, name: e.target.value || undefined })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                placeholder="Filter by category..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={searchParams.category || ''}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, category: e.target.value || undefined })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price
              </label>
              <input
                type="number"
                placeholder="Min price..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={searchParams.minPrice || ''}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    minPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <input
                type="number"
                placeholder="Max price..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={searchParams.maxPrice || ''}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </div>
          </form>
        </div>

        {/* Sweets Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading sweets...</p>
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">No sweets found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sweets.map((sweet) => (
              <div
                key={sweet.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {sweet.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Category: <span className="font-medium">{sweet.category}</span>
                  </p>
                  <p className="text-2xl font-bold text-primary-600 mb-4">
                    ₹{sweet.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Available: <span className="font-medium">{sweet.quantity}</span>
                  </p>

                  {sweet.quantity > 0 ? (
                    <div className="space-y-3">
                      <input
                        type="number"
                        min="1"
                        max={sweet.quantity}
                        placeholder="Quantity"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={purchaseQuantity[sweet.id] || ''}
                        onChange={(e) =>
                          setPurchaseQuantity({
                            ...purchaseQuantity,
                            [sweet.id]: Number(e.target.value),
                          })
                        }
                      />
                      <button
                        onClick={() => handlePurchase(sweet)}
                        disabled={purchaseMutation.isPending}
                        className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {purchaseMutation.isPending ? 'Processing...' : 'Purchase'}
                      </button>
                    </div>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed"
                    >
                      Out of Stock
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;


