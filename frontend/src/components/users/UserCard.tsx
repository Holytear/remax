import React from 'react';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface UserCardProps {
  user: User;
  color?: string;
  onReview?: (id: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, color, onReview }) => {
  return (
    <div className="bg-white rounded-xl shadow p-8 w-full max-w-xs flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:bg-gray-50">
      <img src={user.avatar} alt={user.first_name} className="w-20 h-20 rounded-full mb-2 border-2 border-blue-200" />
      <div className="font-semibold text-gray-800 text-lg">{user.first_name} {user.last_name}</div>
      <button
        className="mt-2 px-4 py-2 rounded border font-medium transition-colors duration-200"
        style={{ background: color || 'transparent', color: color ? '#fff' : '#2563eb', borderColor: color || '#2563eb' }}
        onClick={() => onReview && onReview(user.id)}
      >
        Review
      </button>
    </div>
  );
};

export default UserCard; 