import { describe, it, expect } from 'vitest';
import { filterJobs, sortByNewest, formatPostedDate } from './jobs';
import type { Job } from '../types/job';

function makeJob(
    slug: string,
    postedDate: string,
    department = 'Technology',
    location = 'Remote',
): Job {
    return {
        slug,
        title: `Role ${slug}`,
        department,
        location,
        type: 'Full-time',
        remote: true,
        postedDate,
        summary: 'A role.',
    };
}

describe('filterJobs', () => {
    const jobs = [
        makeJob('tech-remote', '2027-01-01', 'Technology', 'Remote'),
        makeJob('tech-seattle', '2027-02-01', 'Technology', 'Seattle'),
        makeJob('finance-remote', '2027-03-01', 'Finance', 'Remote'),
    ];

    it('filters by department', () => {
        expect(filterJobs(jobs, 'Technology').map((job) => job.slug)).toEqual([
            'tech-remote',
            'tech-seattle',
        ]);
    });

    it('filters by location', () => {
        expect(filterJobs(jobs, '', 'Remote').map((job) => job.slug)).toEqual([
            'tech-remote',
            'finance-remote',
        ]);
    });

    it('combines department and location filters', () => {
        expect(
            filterJobs(jobs, 'Technology', 'Remote').map((job) => job.slug),
        ).toEqual(['tech-remote']);
    });

    it('returns all jobs when both filters are unset', () => {
        expect(filterJobs(jobs).map((job) => job.slug)).toEqual([
            'tech-remote',
            'tech-seattle',
            'finance-remote',
        ]);
    });

    it('returns no jobs when no roles match', () => {
        expect(filterJobs(jobs, 'Finance', 'Seattle')).toEqual([]);
    });
});

describe('sortByNewest', () => {
    it('orders jobs by posted date, newest first', () => {
        const jobs = [
            makeJob('a', '2027-01-01'),
            makeJob('b', '2027-03-15'),
            makeJob('c', '2027-02-10'),
        ];
        expect(sortByNewest(jobs).map((j) => j.slug)).toEqual(['b', 'c', 'a']);
    });

    it('does not mutate the input array', () => {
        const jobs = [makeJob('a', '2027-01-01'), makeJob('b', '2027-03-15')];
        const original = jobs.map((j) => j.slug);
        sortByNewest(jobs);
        expect(jobs.map((j) => j.slug)).toEqual(original);
    });
});

describe('formatPostedDate', () => {
    it('formats an ISO date as a readable string', () => {
        expect(formatPostedDate('2027-01-05')).toBe('January 5, 2027');
    });

    it('returns the raw value when the date is unparseable', () => {
        expect(formatPostedDate('not-a-date')).toBe('not-a-date');
    });
});
