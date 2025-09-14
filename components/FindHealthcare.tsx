import React, { useState } from 'react';
import type { HealthcareProvider, GroundingChunk } from '../types';
import { findNearbyHealthcare } from '../services/geminiService';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from './common/Card';
import { Spinner } from './common/Spinner';
import { HealthcareProviderSkeleton } from './common/Skeleton';

const FindHealthcare: React.FC = () => {
  const [location, setLocation] = useState('');
  const [searchType, setSearchType] = useState<'doctor/clinic' | 'hospital'>('doctor/clinic');
  const [results, setResults] = useState<HealthcareProvider[]>([]);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) {
      setError('Please enter a location (e.g., city, zip code).');
      return;
    }
    setError('');
    setIsLoading(true);
    setSearched(true);
    setResults([]);
    setSources([]);

    const { providers, sources } = await findNearbyHealthcare(location, searchType);
    setResults(providers);
    setSources(sources);
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Nearby Healthcare</CardTitle>
        <CardDescription>
            Enter your location to find real doctors, clinics, or hospitals near you, powered by Google Search.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-100 rounded-lg">
          <div className="w-full sm:w-auto flex-grow">
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your City or Zip Code"
              className="w-full"
              aria-label="Location"
            />
          </div>
          <div className="flex items-center gap-4">
            <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as 'doctor/clinic' | 'hospital')}
                className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                aria-label="Search type"
                >
                <option value="doctor/clinic">Doctors/Clinics</option>
                <option value="hospital">Hospitals</option>
            </select>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? <Spinner size="sm" /> : 'Search'}
            </Button>
          </div>
        </form>
         {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        <div className="mt-6">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <HealthcareProviderSkeleton />
                <HealthcareProviderSkeleton />
                <HealthcareProviderSkeleton />
                <HealthcareProviderSkeleton />
            </div>
          )}
          {!isLoading && results.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((provider, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-slate-200">
                    <h3 className="font-bold text-teal-700">{provider.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{provider.description}</p>
                    <p className="text-sm text-slate-500 mt-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                      {provider.address}
                    </p>
                    <p className="text-sm text-slate-500 mt-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.518.759a11.03 11.03 0 006.254 6.254l.759-1.518a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                      {provider.phone}
                    </p>
                  </div>
                ))}
              </div>

              {sources.length > 0 && (
                <div className="mt-6 p-4 bg-slate-50 rounded-lg border">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Sourced from:</h4>
                    <ul className="space-y-1 list-disc list-inside">
                        {sources.map((source, index) => (
                            <li key={index} className="text-xs">
                                <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline break-all">
                                    {source.web.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
              )}
               <p className="text-xs text-slate-400 mt-4 text-center">
                AI-generated results powered by Google Search. Always verify information with the provider directly.
              </p>
            </>
          )}
          {!isLoading && searched && results.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <p>No results found for your search.</p>
              <p className="text-sm">Please try a different location or check for typos.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FindHealthcare;
