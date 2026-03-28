// Record della tabella files
export type FilesRecord = {
  id: number;
  name: string;
  tag: string | null;
  file_type: string;
  date: string;
  building_site_id: number;
  owner_id: number;
  uploaded_at: string;
  storage_key: string;
  is_generated: boolean;
  project_id: number | null;
};

// Record della tabella projects
export type ProjectsRecord = {
  id: number;
  name: string;
  content_json: any;
  metadata: any;
  created_at: string;
  updated_at: string;
  owner_id: number | null;
  building_site_id: number;
  date: string;
};

// Record della tabella documents
export type DocumentsRecord = {
  id: number;
  file_id: number;
  content_json: any;
};