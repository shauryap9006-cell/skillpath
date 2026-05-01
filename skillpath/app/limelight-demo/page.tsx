'use client';

import { LimelightNav } from "@/components/ui/limelight-nav";
import { Home, Bookmark, PlusCircle, User, Settings } from 'lucide-react';

const customNavItems = [
  { id: 'home', icon: <Home />, label: 'Home', onClick: () => console.log('Home Clicked!') },
  { id: 'bookmark', icon: <Bookmark />, label: 'Bookmarks', onClick: () => console.log('Bookmark Clicked!') },
  { id: 'add', icon: <PlusCircle />, label: 'Add New', onClick: () => console.log('Add Clicked!') },
  { id: 'profile', icon: <User />, label: 'Profile', onClick: () => console.log('Profile Clicked!') },
  { id: 'settings', icon: <Settings />, label: 'Settings', onClick: () => console.log('Settings Clicked!') },
];

export default function LimelightDemo() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black gap-12">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-white font-mono text-sm uppercase tracking-widest">Default Limelight</h2>
        <LimelightNav />
      </div>

      <div className="flex flex-col items-center gap-4">
        <h2 className="text-white font-mono text-sm uppercase tracking-widest">Customized Limelight</h2>
        <LimelightNav 
          className="bg-zinc-900 border-zinc-800 rounded-2xl" 
          items={customNavItems} 
        />
      </div>
    </div>
  );
}
