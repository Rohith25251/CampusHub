export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatTime = (timeString) => {
  return timeString || '';
};

export const formatDateTime = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const getDaysUntil = (dateString) => {
  const eventDate = new Date(dateString);
  const today = new Date();
  const difference = eventDate - today;
  const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
  return days;
};

export const getEventStatus = (dateString) => {
  const days = getDaysUntil(dateString);
  if (days < 0) return 'completed';
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days <= 7) return 'this-week';
  return 'upcoming';
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const truncateText = (text, length = 50) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const getStatusColor = (status) => {
  const colors = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    ongoing: 'bg-purple-100 text-purple-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getCategoryColor = (category) => {
  const colors = {
    Conference: 'bg-blue-100 text-blue-800',
    Sports: 'bg-green-100 text-green-800',
    Entertainment: 'bg-purple-100 text-purple-800',
    Workshop: 'bg-yellow-100 text-yellow-800',
    Seminar: 'bg-pink-100 text-pink-800',
    'Social': 'bg-indigo-100 text-indigo-800',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
};

export const sortEventsByDate = (events) => {
  return [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const sortEventsByTitle = (events) => {
  return [...events].sort((a, b) => a.title.localeCompare(b.title));
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\+?1?\d{9,15}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();
};

export const calculateCapacityPercentage = (attendees, capacity) => {
  if (capacity === 0) return 0;
  return Math.round((attendees / capacity) * 100);
};

export const getCapacityStatus = (percentage) => {
  if (percentage >= 90) return { label: 'Full', color: 'text-red-600', bgColor: 'bg-red-50' };
  if (percentage >= 70) return { label: 'High', color: 'text-orange-600', bgColor: 'bg-orange-50' };
  if (percentage >= 50) return { label: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
  return { label: 'Low', color: 'text-green-600', bgColor: 'bg-green-50' };
};
