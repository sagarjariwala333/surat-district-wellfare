'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function HelpRequestsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const debouncedSearch = useDebounce(search, 500);

  const fetchRequests = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      search: debouncedSearch,
      status,
    });
    try {
      const res = await fetch(`/api/admin/help-requests?${params.toString()}`);
      const d = await res.json();
      setData(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page, debouncedSearch, status]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="container max-w-screen-xl mx-auto py-16 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Financial Help Requests</h1>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find requests by title, description, or filter by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Requests</Label>
              <Input
                id="search"
                placeholder="Title, Description..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Filter by Status</Label>
              <Select value={status || "all"} onValueChange={(value) => {
                setStatus(value === "all" ? "" : value);
                setPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-6 mb-8">
        {loading ? (
          <Card>
            <CardContent className="text-center py-8">
              Loading requests...
            </CardContent>
          </Card>
        ) : data?.requests.map((req: any) => (
          <Card key={req._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl text-destructive">{req.title}</CardTitle>
                <Button 
                  variant={getStatusVariant(req.status)} 
                  size="sm" 
                  className="text-xs uppercase"
                >
                  {req.status}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 whitespace-pre-wrap text-muted-foreground">
                {req.description}
              </p>
              <div className="flex justify-between text-sm text-muted-foreground">
                <div>
                  <strong>Mobile:</strong> {req.mobileNumber}
                </div>
                <div>
                  <strong>Submitted:</strong> {new Date(req.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {!loading && data?.requests.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              No help requests found.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {data?.pages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-sm">
            Page {page} of {data.pages}
          </span>
          <Button
            variant="outline"
            disabled={page === data.pages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
