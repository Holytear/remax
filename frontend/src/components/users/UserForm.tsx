import React from "react";
import Button from "@/components/ui/Button";

interface UserFormProps {
  form: { first_name: string; last_name: string; email: string; age: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  status?: string | null;
  submitLabel?: string;
}

const UserForm: React.FC<UserFormProps> = ({ form, onChange, onSubmit, loading, status, submitLabel }) => (
  <form className="flex flex-col gap-3" onSubmit={onSubmit}>
    <input className="border rounded px-3 py-2" placeholder="First Name" name="first_name" value={form.first_name} onChange={onChange} required />
    <input className="border rounded px-3 py-2" placeholder="Last Name" name="last_name" value={form.last_name} onChange={onChange} required />
    <input className="border rounded px-3 py-2" placeholder="Email" type="email" name="email" value={form.email} onChange={onChange} required />
    <input className="border rounded px-3 py-2" placeholder="Age" type="number" name="age" value={form.age} onChange={onChange} required min={1} />
    <Button type="submit" className="mt-2 disabled:opacity-50" disabled={loading}>
      {loading ? "Saving..." : submitLabel || "Save"}
    </Button>
    {status && <div className="text-center text-sm mt-2 text-blue-600">{status}</div>}
  </form>
);

export default UserForm; 