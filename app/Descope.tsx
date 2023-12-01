'use client'

// TODO: Check why we can't just import Descope 
// from '@descope/react-sdk' and directly export it

import dynamic from 'next/dynamic';
const Descope = dynamic(
    () => import('@descope/react-sdk').then(module => module.Descope),
    { ssr: false }
);

export default Descope;