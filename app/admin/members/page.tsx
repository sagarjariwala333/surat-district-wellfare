'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DateRangePicker from '@/components/DateRangePicker';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function MembersPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const debouncedSearch = useDebounce(search, 500);

  const fetchMembers = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      search: debouncedSearch,
      startDate,
      endDate,
    });
    try {
      const res = await fetch(`/api/admin/members?${params.toString()}`);
      const d = await res.json();
      setData(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [page, debouncedSearch, startDate, endDate]);

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setPage(1);
  };

  return (
    <div className="container max-w-screen-xl mx-auto py-16 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Paid Members</h1>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find members by name, ID, email, or filter by payment date</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Members</Label>
              <Input
                id="search"
                placeholder="Name, ID, Email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Date Filter (Single or Range)</Label>
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onChange={handleDateChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Sanad ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Payment Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : data?.users.map((user: any) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.sanadId}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.mobileNumber}</TableCell>
                  <TableCell>{new Date(user.paymentDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {!loading && data?.users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <Card>
            <CardContent className="text-center py-8">
              Loading...
            </CardContent>
          </Card>
        ) : data?.users.map((user: any) => (
          <Card key={user._id}>
            <CardHeader>
              <CardTitle className="text-lg text-primary">
                {user.firstName} {user.lastName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                <span className="text-muted-foreground">Sanad ID:</span>
                <span>{user.sanadId}</span>
                <span className="text-muted-foreground">Email:</span>
                <span className="break-all">{user.email}</span>
                <span className="text-muted-foreground">Mobile:</span>
                <span>{user.mobileNumber}</span>
                <span className="text-muted-foreground">Paid on:</span>
                <span>{new Date(user.paymentDate).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {!loading && data?.users.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              No members found.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {data?.pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
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
