import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWebSocket } from '../context/WebSocketContext';
import { Lead, LeadStatus } from '../types/lead';

const statusOptions: LeadStatus[] = ['new', 'contacted', 'qualified', 'lost'];

const LeadForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads, updateLead, addLead } = useWebSocket();

  const [lead, setLead] = React.useState<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> | Lead>({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'new',
    notes: ''
  });

  useEffect(() => {
    if (id) {
      const existingLead = leads.find(lead => lead.id === id);
      if (existingLead) {
        setLead(existingLead);
      }
    }
  }, [id, leads]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLead(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if ('id' in lead) {
      updateLead(lead as Lead);
    } else {
      addLead(lead);
    }

    navigate('/', { replace: true });
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-light">
        <div className="card-header bg-primary text-white text-center">
          <h2>{'id' in lead ? 'Edit Lead' : 'Add New Lead'}</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={lead.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={lead.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-control"
                value={lead.phone}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="company" className="form-label">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                className="form-control"
                value={lead.company}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={lead.status}
                onChange={handleChange}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="notes" className="form-label">Notes</label>
              <textarea
                id="notes"
                name="notes"
                className="form-control"
                value={lead.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-success">
                {'id' in lead ? 'Update Lead' : 'Add Lead'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadForm;
