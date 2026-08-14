const mockUser = {
  name: 'Beatriz Campos',
  email: 'beatriz@example.com',
  phone: '+34 600 000 000',
  city: 'Barcelona',
  country: 'Spain',
  address: 'Carrer Falsa 123',
  title: 'Frontend Engineer',
  about: 'Passionate frontend developer focusing on React and modern web UX.',
  experience: [
    { company: 'Acme Corp', position: 'Frontend Engineer', start: '2020-01', end: '2023-06', description: 'Worked on UI components and performance.' },
    { company: 'Tech Studio', position: 'Junior Developer', start: '2018-06', end: '2019-12', description: 'Built internal tools and dashboards.' }
  ],
  education: [
    { institution: 'University of Barcelona', degree: 'BSc Computer Science', field: 'Computer Science', start: '2014', end: '2018' }
  ],
  skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Git', 'Docker'],
  interests: ['Frontend', 'AI', 'UX/UI'],
  preferences: { remote: true, employmentType: 'Full-time', preferredLocations: ['Remote', 'Barcelona'] },
  links: { linkedin: 'https://linkedin.com/in/beatriz', github: 'https://github.com/beatriz' },
  cv: { name: 'Beatriz_CV.pdf', url: '#' },
  applicationsCount: 8,
  savedJobsCount: 14,
  interviewsCount: 2
}

const mockJobs = [
  { id: 1, title: 'Senior Frontend Engineer', company: 'Rocket Labs', location: 'Remote', salary: '€60-80k', match: 92, type: 'Full-time', labels: ['Remote'], description: 'Work on high-performance frontends.', tags: ['React','TypeScript'] },
  { id: 2, title: 'Frontend Engineer', company: 'Design Studio', location: 'Barcelona', salary: '€45-60k', match: 88, type: 'Full-time', labels: ['Hybrid'], description: 'Design-focused frontend role.', tags: ['React','CSS'] },
  { id: 3, title: 'Full Stack Developer', company: 'ScaleUp', location: 'Madrid', salary: '€50-70k', match: 81, type: 'Full-time', labels: ['On-site'], description: 'Full stack responsibilities.', tags: ['Node','React'] }
]

export function getUser() { return {...mockUser} }
export function updateUser(updater){
  Object.assign(mockUser, updater)
}
export function getJobs(){ return mockJobs }

export default mockUser
