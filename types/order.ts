export type OrderStatus =
  | "New"
  | "Pending"
  | "In Progress"
  | "Awaiting Content"
  | "Ready for Review"
  | "Completed"
  | "Delivered"
  | "Cancelled";

export interface Order {
  id: number;

  business_name: string;
  contact_person: string;
  whatsapp: string;
  email: string;

  business_type: string;
  template: string;

  website_description: string;
  business_address: string;
  address?: string;
  notes?: string;
  package_name?: string;
  amount?: number;

  logo_url: string;
  image_urls: string[];

  status: OrderStatus | string;
  generated_website_id?: number;

  created_at: string;
}