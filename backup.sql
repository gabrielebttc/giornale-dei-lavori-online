--
-- PostgreSQL database dump
--

\restrict ZUa6Rk533l9SAaq8DxuJh7iIOPtGBjctwOgRVZsb5jzrCKV9mb3hOcoWBenpk9N

-- Dumped from database version 17.7 (Ubuntu 17.7-0ubuntu0.25.04.1)
-- Dumped by pg_dump version 17.7 (Ubuntu 17.7-0ubuntu0.25.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: building_sites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.building_sites (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    notes text,
    city character varying(100),
    address character varying(255),
    latitude numeric(9,6),
    longitude numeric(9,6),
    owner_id integer NOT NULL,
    start_date date NOT NULL,
    end_date date
);


--
-- Name: building_sites_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.building_sites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: building_sites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.building_sites_id_seq OWNED BY public.building_sites.id;


--
-- Name: companies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    notes text,
    owner_id integer NOT NULL
);


--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- Name: daily_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.daily_notes (
    id integer NOT NULL,
    date date NOT NULL,
    building_site_id integer NOT NULL,
    notes text,
    other_notes text,
    personal_notes text,
    owner_id integer NOT NULL
);


--
-- Name: daily_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.daily_notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: daily_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.daily_notes_id_seq OWNED BY public.daily_notes.id;


--
-- Name: daily_presences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.daily_presences (
    id integer NOT NULL,
    building_site_id integer NOT NULL,
    user_id integer NOT NULL,
    date date NOT NULL,
    is_present character varying(20) NOT NULL,
    notes text,
    owner_id integer NOT NULL,
    CONSTRAINT daily_presences_is_present_check CHECK (((is_present)::text = ANY (ARRAY[('present'::character varying)::text, ('absent'::character varying)::text, ('not_required'::character varying)::text])))
);


--
-- Name: daily_presences_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.daily_presences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: daily_presences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.daily_presences_id_seq OWNED BY public.daily_presences.id;


--
-- Name: documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.documents (
    id integer NOT NULL,
    file_id integer NOT NULL,
    content_json jsonb
);


--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- Name: files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.files (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    tag character varying(36),
    file_type character varying(36) NOT NULL,
    date date NOT NULL,
    building_site_id integer NOT NULL,
    owner_id integer NOT NULL,
    uploaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    storage_key text NOT NULL,
    is_generated boolean DEFAULT false NOT NULL,
    project_id integer
);


--
-- Name: files_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_json jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    owner_id integer,
    building_site_id integer NOT NULL,
    date date NOT NULL
);


--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: teams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teams (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


--
-- Name: teams_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.teams_id_seq OWNED BY public.teams.id;


--
-- Name: templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.templates (
    id integer NOT NULL,
    name character varying(40) NOT NULL,
    content_json jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    owner_id integer
);


--
-- Name: templates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.templates_id_seq OWNED BY public.templates.id;


--
-- Name: user_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_type (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    owner_id integer
);


--
-- Name: user_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_type_id_seq OWNED BY public.user_type.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    username character varying(50),
    email character varying(100),
    password character varying(255),
    phone character varying(15),
    notes text,
    owner_id integer NOT NULL,
    refresh_token text
);


--
-- Name: users_building_sites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_building_sites (
    id integer NOT NULL,
    user_id integer NOT NULL,
    site_id integer NOT NULL
);


--
-- Name: users_bulding_sites_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_bulding_sites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_bulding_sites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_bulding_sites_id_seq OWNED BY public.users_building_sites.id;


--
-- Name: users_companies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_companies (
    id integer NOT NULL,
    user_id integer NOT NULL,
    company_id integer NOT NULL
);


--
-- Name: users_companies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_companies_id_seq OWNED BY public.users_companies.id;


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_teams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_teams (
    id integer NOT NULL,
    user_id integer NOT NULL,
    team_id integer NOT NULL
);


--
-- Name: users_teams_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_teams_id_seq OWNED BY public.users_teams.id;


--
-- Name: users_user_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_user_type (
    id integer NOT NULL,
    user_id integer NOT NULL,
    user_type_id integer NOT NULL
);


--
-- Name: users_user_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_user_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_user_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_user_type_id_seq OWNED BY public.users_user_type.id;


--
-- Name: building_sites id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.building_sites ALTER COLUMN id SET DEFAULT nextval('public.building_sites_id_seq'::regclass);


--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: daily_notes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_notes ALTER COLUMN id SET DEFAULT nextval('public.daily_notes_id_seq'::regclass);


--
-- Name: daily_presences id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_presences ALTER COLUMN id SET DEFAULT nextval('public.daily_presences_id_seq'::regclass);


--
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- Name: files id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: teams id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);


--
-- Name: templates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.templates ALTER COLUMN id SET DEFAULT nextval('public.templates_id_seq'::regclass);


--
-- Name: user_type id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_type ALTER COLUMN id SET DEFAULT nextval('public.user_type_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: users_building_sites id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_building_sites ALTER COLUMN id SET DEFAULT nextval('public.users_bulding_sites_id_seq'::regclass);


--
-- Name: users_companies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_companies ALTER COLUMN id SET DEFAULT nextval('public.users_companies_id_seq'::regclass);


--
-- Name: users_teams id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_teams ALTER COLUMN id SET DEFAULT nextval('public.users_teams_id_seq'::regclass);


--
-- Name: users_user_type id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_user_type ALTER COLUMN id SET DEFAULT nextval('public.users_user_type_id_seq'::regclass);


--
-- Data for Name: building_sites; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.building_sites (id, name, notes, city, address, latitude, longitude, owner_id, start_date, end_date) FROM stdin;
1	Cantiere di Prova	Questo è un cantiere di prova. Puoi aggiungere in questo campo delle note utili specifiche per questo cantiere	Licata	Via Raffadali, 3	37.101567	13.937183	3	2026-01-01	\N
2	Cantiere di Prova - Conad ASG SRL	Note di prova per il cantiere.	\N	Via Roma 10, Milano	\N	\N	11	2026-02-01	\N
3	Cantiere di Prova - Conad ASG SRL	Note di prova per il cantiere.	\N	Via Roma 10, Milano	\N	\N	18	2026-02-01	\N
4	Cantiere di Prova - Conad ASG SRL	Note di prova per il cantiere.	\N	Via Roma 10, Milano	\N	\N	25	2026-02-01	2026-03-07
5	Cantiere di Prova - Conad ASG SRL	Note di prova per il cantiere.	\N	Via Roma 10, Milano	\N	\N	32	2026-02-01	\N
6	Cantiere di Prova - Conad ASG SRL	Note di prova per il cantiere.	\N	Via Roma 10, Milano	\N	\N	39	2026-02-01	2026-02-21
7	Cantiere di Prova - Conad ASG SRL	Note di prova per il cantiere.	Abbadia Cerreto	Via Roma 10, Milano	45.312391	9.592525	46	2026-02-08	2026-02-28
8	Cantiere di Prova - Conad ASG SRL	Note di prova per il cantiere.	Abbadia Lariana	Via Roma 10	45.900500	9.334549	53	2026-02-08	2026-02-28
9	casa gabriele	boh	Raffadali	via yooo	37.404897	13.531094	53	2026-02-28	\N
10	fdasdfas	fas	Raffadali	fads	37.404897	13.531094	53	2026-02-13	\N
11	Cantiere di Prova - Conad ASG SRL	Note di prova per il cantiere.	Abbadia Cerreto	Via Roma 10	45.312391	9.592525	60	2026-03-12	2026-04-01
12	Cantiere di Prova - Conad ASG SRL	Note di prova per il cantiere.	Milano	Via Roma 10	45.466794	9.190347	67	2026-03-12	2026-04-01
13	Villa rossiccia	asdfas	Agliè	boh	45.363433	7.768600	67	2026-03-20	\N
20	asdfas	fasdfas	Cavour	fsdafsdafa	44.784031	7.375232	67	2026-03-01	\N
22	Cantiere di Prova - Conad ASG SRL	Note di prova per il cantiere.	Milano	Via Roma 10	45.466794	9.190347	81	2026-03-29	2026-04-30
23	Cantiere di Prova - Conad ASG SRL	Note di prova per il cantiere.	Milano	Via Roma 10	45.466794	9.190347	88	2026-03-31	2026-04-20
24	Cantiere di Prova - Conad ASG SRL	Note di prova per il cantiere.	Milano	Via Roma 10	45.466794	9.190347	95	2026-03-31	2026-04-20
25	Cantiere di Prova - Conad ASG SRL	Note di prova per il cantiere.	Milano	Via Roma 10	45.466794	9.190347	102	2026-03-31	2026-04-20
27	Cantiere di Prova - Conad ASG SRL	Note di prova per il cantiere.	Milano	Via Roma 10	45.466794	9.190347	116	2026-03-31	2026-04-20
28	Cantiere di Prova - Conad ASG SRL	Note di prova per il cantiere.	Milano	Via Roma 10	45.466794	9.190347	123	2026-03-31	2026-04-20
29	Cantiere di Prova - Conad ASG SRL	Note di prova per il cantiere.	Milano	Via Roma 10	45.466794	9.190347	130	2026-03-31	2026-04-20
30	Cantiere di Prova - Conad ASG SRL	Note di prova per il cantiere.	Milano	Via Roma 10	45.466794	9.190347	137	2026-03-31	2026-04-20
31	Locanda del polacco b and b	quello nella frazione di ravenna Ducenta	Ravenna	Ducenta	44.417225	12.199139	137	2026-03-02	2026-07-02
21	Cantiere di Prova - Conad ASG SRL	Note di prova per il cantiere.	Milano	Via Roma 10	45.466794	9.190347	74	2026-03-01	2026-06-30
33	Cantiere di Prova - Conad ASG SRL	Note di prova per il cantiere.	Milano	Via Roma 10	45.466794	9.190347	144	2026-04-01	2026-04-21
34	Cantiere di Prova - Conad ASG SRL	Note di prova per il cantiere.	Milano	Via Roma 10	45.466794	9.190347	145	2026-04-01	2026-04-21
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.companies (id, name, notes, owner_id) FROM stdin;
1	Sferas	\N	3
2	Imbianchini	\N	3
3	Libero Professionista	\N	3
4	Arma dei CC	\N	3
5	Criscenti	\N	3
9	Fratelli Russo Idraulica Srl	\N	11
10	BRUNO E FRETTO SRL	\N	11
11	Sicurezza Totale S.p.A.	\N	11
12	Fratelli Russo Idraulica Srl	\N	18
13	BRUNO E FRETTO SRL	\N	18
14	Sicurezza Totale S.p.A.	\N	18
15	Edilizia Generale	\N	18
16	Fratelli Russo Idraulica Srl	\N	25
17	BRUNO E FRETTO SRL	\N	25
18	Edilizia Generale S.p.A.	\N	25
19	Studio Tecnico Associato	\N	25
20	Fratelli Russo Idraulica Srl	\N	32
21	BRUNO E FRETTO SRL	\N	32
22	Edilizia Generale S.p.A.	\N	32
23	Studio Tecnico Associato	\N	32
24	Fratelli Russo Idraulica Srl	\N	39
25	BRUNO E FRETTO SRL	\N	39
26	Edilizia Generale S.p.A.	\N	39
27	Studio Tecnico Associato	\N	39
28	Fratelli Russo Idraulica Srl	\N	46
29	BRUNO E FRETTO SRL	\N	46
30	Edilizia Generale S.p.A.	\N	46
31	Studio Tecnico Associato	\N	46
32	Fratelli Russo Idraulica Srl	\N	53
33	BRUNO E FRETTO SRL	\N	53
34	Edilizia Generale S.p.A.	\N	53
35	Studio Tecnico Associato	\N	53
36	Fratelli Russo Idraulica Srl	\N	60
37	BRUNO E FRETTO SRL	\N	60
38	Edilizia Generale S.p.A.	\N	60
39	Studio Tecnico Associato	\N	60
40	Fratelli Russo Idraulica Srl	\N	67
41	BRUNO E FRETTO SRL	\N	67
42	Edilizia Generale S.p.A.	\N	67
43	Studio Tecnico Associato	\N	67
44	Fratelli Russo Idraulica Srl	\N	74
45	BRUNO E FRETTO SRL	\N	74
46	Edilizia Generale S.p.A.	\N	74
47	Studio Tecnico Associato	\N	74
48	Fratelli Russo Idraulica Srl	\N	81
49	BRUNO E FRETTO SRL	\N	81
50	Edilizia Generale S.p.A.	\N	81
51	Studio Tecnico Associato	\N	81
52	Fratelli Russo Idraulica Srl	\N	88
53	BRUNO E FRETTO SRL	\N	88
54	Edilizia Generale S.p.A.	\N	88
55	Studio Tecnico Associato	\N	88
56	Fratelli Russo Idraulica Srl	\N	95
57	BRUNO E FRETTO SRL	\N	95
58	Edilizia Generale S.p.A.	\N	95
59	Studio Tecnico Associato	\N	95
60	Fratelli Russo Idraulica Srl	\N	102
61	BRUNO E FRETTO SRL	\N	102
62	Edilizia Generale S.p.A.	\N	102
63	Studio Tecnico Associato	\N	102
68	Fratelli Russo Idraulica Srl	\N	116
69	BRUNO E FRETTO SRL	\N	116
70	Edilizia Generale S.p.A.	\N	116
71	Studio Tecnico Associato	\N	116
72	Fratelli Russo Idraulica Srl	\N	123
73	BRUNO E FRETTO SRL	\N	123
74	Edilizia Generale S.p.A.	\N	123
75	Studio Tecnico Associato	\N	123
76	Fratelli Russo Idraulica Srl	\N	130
77	BRUNO E FRETTO SRL	\N	130
78	Edilizia Generale S.p.A.	\N	130
79	Studio Tecnico Associato	\N	130
80	Fratelli Russo Idraulica Srl	\N	137
81	BRUNO E FRETTO SRL	\N	137
82	Edilizia Generale S.p.A.	\N	137
83	Studio Tecnico Associato	\N	137
84	Libero Professionista	è mio cugino	137
85	Fratelli Russo Idraulica Srl	\N	144
86	BRUNO E FRETTO SRL	\N	144
87	Edilizia Generale S.p.A.	\N	144
88	Studio Tecnico Associato	\N	144
89	Fratelli Russo Idraulica Srl	\N	145
90	BRUNO E FRETTO SRL	\N	145
91	Edilizia Generale S.p.A.	\N	145
92	Studio Tecnico Associato	\N	145
\.


--
-- Data for Name: daily_notes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.daily_notes (id, date, building_site_id, notes, other_notes, personal_notes, owner_id) FROM stdin;
1	2026-02-05	1	\N	\N	ciaooo	3
2	2026-02-01	2	Lavori giorno 1	\N	\N	11
3	2026-02-02	2	Lavori giorno 2	\N	\N	11
4	2026-02-03	2	Lavori giorno 3	\N	\N	11
5	2026-02-04	2	Lavori giorno 4	\N	\N	11
6	2026-02-05	2	Lavori giorno 5	\N	\N	11
7	2026-02-06	2	Lavori giorno 6	\N	\N	11
8	2026-02-07	2	Lavori giorno 7	\N	\N	11
9	2026-02-08	2	Lavori giorno 8	\N	\N	11
10	2026-02-09	2	Lavori giorno 9	\N	\N	11
11	2026-02-10	2	Lavori giorno 10	\N	\N	11
12	2026-02-01	3	Resoconto lavori giorno 1: attività di routine e controllo sicurezza.	\N	\N	18
13	2026-02-02	3	Resoconto lavori giorno 2: attività di routine e controllo sicurezza.	\N	\N	18
14	2026-02-03	3	Resoconto lavori giorno 3: attività di routine e controllo sicurezza.	\N	\N	18
15	2026-02-04	3	Resoconto lavori giorno 4: attività di routine e controllo sicurezza.	\N	\N	18
16	2026-02-05	3	Resoconto lavori giorno 5: attività di routine e controllo sicurezza.	\N	\N	18
17	2026-02-06	3	Resoconto lavori giorno 6: attività di routine e controllo sicurezza.	\N	\N	18
18	2026-02-07	3	Resoconto lavori giorno 7: attività di routine e controllo sicurezza.	\N	\N	18
19	2026-02-08	3	Resoconto lavori giorno 8: attività di routine e controllo sicurezza.	\N	\N	18
20	2026-02-09	3	Resoconto lavori giorno 9: attività di routine e controllo sicurezza.	\N	\N	18
21	2026-02-10	3	Resoconto lavori giorno 10: attività di routine e controllo sicurezza.	\N	\N	18
22	2026-02-11	3	Resoconto lavori giorno 11: attività di routine e controllo sicurezza.	\N	\N	18
23	2026-02-12	3	Resoconto lavori giorno 12: attività di routine e controllo sicurezza.	\N	\N	18
24	2026-02-13	3	Resoconto lavori giorno 13: attività di routine e controllo sicurezza.	\N	\N	18
25	2026-02-14	3	Resoconto lavori giorno 14: attività di routine e controllo sicurezza.	\N	\N	18
26	2026-02-15	3	Resoconto lavori giorno 15: attività di routine e controllo sicurezza.	\N	\N	18
27	2026-02-16	3	Resoconto lavori giorno 16: attività di routine e controllo sicurezza.	\N	\N	18
28	2026-02-17	3	Resoconto lavori giorno 17: attività di routine e controllo sicurezza.	\N	\N	18
29	2026-02-18	3	Resoconto lavori giorno 18: attività di routine e controllo sicurezza.	\N	\N	18
30	2026-02-19	3	Resoconto lavori giorno 19: attività di routine e controllo sicurezza.	\N	\N	18
31	2026-02-20	3	Resoconto lavori giorno 20: attività di routine e controllo sicurezza.	\N	\N	18
33	2026-02-02	4	Tracciamento impianti e scavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 2: verificare qualità dei materiali forniti oggi.	25
34	2026-02-03	4	Posa tubazioni scarico primarie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 3: verificare qualità dei materiali forniti oggi.	25
35	2026-02-04	4	Getto di pulizia e armatura	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 4: verificare qualità dei materiali forniti oggi.	25
36	2026-02-05	4	Chiusura tracce e verifica livelli	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 5: verificare qualità dei materiali forniti oggi.	25
39	2026-02-08	4	Intonacatura grezza piano terra	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 8: verificare qualità dei materiali forniti oggi.	25
40	2026-02-09	4	Impianto elettrico: posa corrugati	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 9: verificare qualità dei materiali forniti oggi.	25
41	2026-02-10	4	Verifica sicurezza e sopralluogo tecnico	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 10: verificare qualità dei materiali forniti oggi.	25
42	2026-02-11	4	Montaggio cartongessi e orditure	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 11: verificare qualità dei materiali forniti oggi.	25
43	2026-02-12	4	Rasatura pareti zona A	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 12: verificare qualità dei materiali forniti oggi.	25
44	2026-02-13	4	Posa massetto autolivellante	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 13: verificare qualità dei materiali forniti oggi.	25
45	2026-02-14	4	Installazione centralina idraulica	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 14: verificare qualità dei materiali forniti oggi.	25
46	2026-02-15	4	Posa pavimenti e rivestimenti	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 15: verificare qualità dei materiali forniti oggi.	25
47	2026-02-16	4	Montaggio infissi esterni	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 16: verificare qualità dei materiali forniti oggi.	25
48	2026-02-17	4	Pittura prima mano e finiture	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 17: verificare qualità dei materiali forniti oggi.	25
49	2026-02-18	4	Installazione sanitari e rubinetterie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 18: verificare qualità dei materiali forniti oggi.	25
50	2026-02-19	4	Pulizia fine cantiere e smaltimento macerie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 19: verificare qualità dei materiali forniti oggi.	25
51	2026-02-20	4	Collaudo finale e consegna chiavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 20: verificare qualità dei materiali forniti oggi.	25
32	2026-02-01	4	Allestimento cantiere e scarico materiali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 1: verificare qualità dei materiali forniti oggi.	25
37	2026-02-06	4	Inizio murature perimetrali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 6: verificare qualità dei materiali forniti oggi.	25
38	2026-02-07	4	Posa controtelai e soglie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 7: verificare qualità dei materiali forniti oggi.	25
55	2026-02-01	5	Allestimento cantiere e scarico materiali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 1: verificare qualità dei materiali forniti oggi.	32
56	2026-02-02	5	Tracciamento impianti e scavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 2: verificare qualità dei materiali forniti oggi.	32
57	2026-02-03	5	Posa tubazioni scarico primarie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 3: verificare qualità dei materiali forniti oggi.	32
58	2026-02-04	5	Getto di pulizia e armatura	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 4: verificare qualità dei materiali forniti oggi.	32
59	2026-02-05	5	Chiusura tracce e verifica livelli	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 5: verificare qualità dei materiali forniti oggi.	32
60	2026-02-06	5	Inizio murature perimetrali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 6: verificare qualità dei materiali forniti oggi.	32
61	2026-02-07	5	Posa controtelai e soglie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 7: verificare qualità dei materiali forniti oggi.	32
62	2026-02-08	5	Intonacatura grezza piano terra	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 8: verificare qualità dei materiali forniti oggi.	32
63	2026-02-09	5	Impianto elettrico: posa corrugati	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 9: verificare qualità dei materiali forniti oggi.	32
64	2026-02-10	5	Verifica sicurezza e sopralluogo tecnico	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 10: verificare qualità dei materiali forniti oggi.	32
65	2026-02-11	5	Montaggio cartongessi e orditure	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 11: verificare qualità dei materiali forniti oggi.	32
66	2026-02-12	5	Rasatura pareti zona A	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 12: verificare qualità dei materiali forniti oggi.	32
67	2026-02-13	5	Posa massetto autolivellante	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 13: verificare qualità dei materiali forniti oggi.	32
68	2026-02-14	5	Installazione centralina idraulica	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 14: verificare qualità dei materiali forniti oggi.	32
69	2026-02-15	5	Posa pavimenti e rivestimenti	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 15: verificare qualità dei materiali forniti oggi.	32
70	2026-02-16	5	Montaggio infissi esterni	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 16: verificare qualità dei materiali forniti oggi.	32
71	2026-02-17	5	Pittura prima mano e finiture	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 17: verificare qualità dei materiali forniti oggi.	32
72	2026-02-18	5	Installazione sanitari e rubinetterie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 18: verificare qualità dei materiali forniti oggi.	32
73	2026-02-19	5	Pulizia fine cantiere e smaltimento macerie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 19: verificare qualità dei materiali forniti oggi.	32
74	2026-02-20	5	Collaudo finale e consegna chiavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 20: verificare qualità dei materiali forniti oggi.	32
75	2026-02-01	6	Allestimento cantiere e scarico materiali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 1: verificare qualità dei materiali forniti oggi.	39
76	2026-02-02	6	Tracciamento impianti e scavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 2: verificare qualità dei materiali forniti oggi.	39
77	2026-02-03	6	Posa tubazioni scarico primarie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 3: verificare qualità dei materiali forniti oggi.	39
78	2026-02-04	6	Getto di pulizia e armatura	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 4: verificare qualità dei materiali forniti oggi.	39
79	2026-02-05	6	Chiusura tracce e verifica livelli	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 5: verificare qualità dei materiali forniti oggi.	39
80	2026-02-06	6	Inizio murature perimetrali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 6: verificare qualità dei materiali forniti oggi.	39
81	2026-02-07	6	Posa controtelai e soglie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 7: verificare qualità dei materiali forniti oggi.	39
82	2026-02-08	6	Intonacatura grezza piano terra	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 8: verificare qualità dei materiali forniti oggi.	39
83	2026-02-09	6	Impianto elettrico: posa corrugati	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 9: verificare qualità dei materiali forniti oggi.	39
84	2026-02-10	6	Verifica sicurezza e sopralluogo tecnico	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 10: verificare qualità dei materiali forniti oggi.	39
85	2026-02-11	6	Montaggio cartongessi e orditure	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 11: verificare qualità dei materiali forniti oggi.	39
86	2026-02-12	6	Rasatura pareti zona A	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 12: verificare qualità dei materiali forniti oggi.	39
87	2026-02-13	6	Posa massetto autolivellante	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 13: verificare qualità dei materiali forniti oggi.	39
88	2026-02-14	6	Installazione centralina idraulica	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 14: verificare qualità dei materiali forniti oggi.	39
89	2026-02-15	6	Posa pavimenti e rivestimenti	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 15: verificare qualità dei materiali forniti oggi.	39
90	2026-02-16	6	Montaggio infissi esterni	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 16: verificare qualità dei materiali forniti oggi.	39
91	2026-02-17	6	Pittura prima mano e finiture	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 17: verificare qualità dei materiali forniti oggi.	39
92	2026-02-18	6	Installazione sanitari e rubinetterie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 18: verificare qualità dei materiali forniti oggi.	39
93	2026-02-19	6	Pulizia fine cantiere e smaltimento macerie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 19: verificare qualità dei materiali forniti oggi.	39
94	2026-02-20	6	Collaudo finale e consegna chiavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 20: verificare qualità dei materiali forniti oggi.	39
95	2026-02-08	7	Allestimento cantiere e scarico materiali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 1: verificare qualità dei materiali forniti oggi.	46
96	2026-02-09	7	Tracciamento impianti e scavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 2: verificare qualità dei materiali forniti oggi.	46
97	2026-02-10	7	Posa tubazioni scarico primarie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 3: verificare qualità dei materiali forniti oggi.	46
98	2026-02-11	7	Getto di pulizia e armatura	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 4: verificare qualità dei materiali forniti oggi.	46
99	2026-02-12	7	Chiusura tracce e verifica livelli	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 5: verificare qualità dei materiali forniti oggi.	46
100	2026-02-13	7	Inizio murature perimetrali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 6: verificare qualità dei materiali forniti oggi.	46
101	2026-02-14	7	Posa controtelai e soglie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 7: verificare qualità dei materiali forniti oggi.	46
102	2026-02-15	7	Intonacatura grezza piano terra	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 8: verificare qualità dei materiali forniti oggi.	46
103	2026-02-16	7	Impianto elettrico: posa corrugati	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 9: verificare qualità dei materiali forniti oggi.	46
104	2026-02-17	7	Verifica sicurezza e sopralluogo tecnico	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 10: verificare qualità dei materiali forniti oggi.	46
105	2026-02-18	7	Montaggio cartongessi e orditure	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 11: verificare qualità dei materiali forniti oggi.	46
106	2026-02-19	7	Rasatura pareti zona A	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 12: verificare qualità dei materiali forniti oggi.	46
107	2026-02-20	7	Posa massetto autolivellante	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 13: verificare qualità dei materiali forniti oggi.	46
108	2026-02-21	7	Installazione centralina idraulica	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 14: verificare qualità dei materiali forniti oggi.	46
109	2026-02-22	7	Posa pavimenti e rivestimenti	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 15: verificare qualità dei materiali forniti oggi.	46
110	2026-02-23	7	Montaggio infissi esterni	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 16: verificare qualità dei materiali forniti oggi.	46
111	2026-02-24	7	Pittura prima mano e finiture	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 17: verificare qualità dei materiali forniti oggi.	46
112	2026-02-25	7	Installazione sanitari e rubinetterie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 18: verificare qualità dei materiali forniti oggi.	46
113	2026-02-26	7	Pulizia fine cantiere e smaltimento macerie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 19: verificare qualità dei materiali forniti oggi.	46
114	2026-02-27	7	Collaudo finale e consegna chiavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 20: verificare qualità dei materiali forniti oggi.	46
115	2026-02-08	8	Allestimento cantiere e scarico materiali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 1: verificare qualità dei materiali forniti oggi.	53
116	2026-02-09	8	Tracciamento impianti e scavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 2: verificare qualità dei materiali forniti oggi.	53
117	2026-02-10	8	Posa tubazioni scarico primarie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 3: verificare qualità dei materiali forniti oggi.	53
118	2026-02-11	8	Getto di pulizia e armatura	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 4: verificare qualità dei materiali forniti oggi.	53
119	2026-02-12	8	Chiusura tracce e verifica livelli	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 5: verificare qualità dei materiali forniti oggi.	53
120	2026-02-13	8	Inizio murature perimetrali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 6: verificare qualità dei materiali forniti oggi.	53
121	2026-02-14	8	Posa controtelai e soglie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 7: verificare qualità dei materiali forniti oggi.	53
122	2026-02-15	8	Intonacatura grezza piano terra	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 8: verificare qualità dei materiali forniti oggi.	53
123	2026-02-16	8	Impianto elettrico: posa corrugati	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 9: verificare qualità dei materiali forniti oggi.	53
124	2026-02-17	8	Verifica sicurezza e sopralluogo tecnico	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 10: verificare qualità dei materiali forniti oggi.	53
125	2026-02-18	8	Montaggio cartongessi e orditure	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 11: verificare qualità dei materiali forniti oggi.	53
126	2026-02-19	8	Rasatura pareti zona A	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 12: verificare qualità dei materiali forniti oggi.	53
127	2026-02-20	8	Posa massetto autolivellante	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 13: verificare qualità dei materiali forniti oggi.	53
128	2026-02-21	8	Installazione centralina idraulica	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 14: verificare qualità dei materiali forniti oggi.	53
129	2026-02-22	8	Posa pavimenti e rivestimenti	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 15: verificare qualità dei materiali forniti oggi.	53
130	2026-02-23	8	Montaggio infissi esterni	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 16: verificare qualità dei materiali forniti oggi.	53
131	2026-02-24	8	Pittura prima mano e finiture	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 17: verificare qualità dei materiali forniti oggi.	53
132	2026-02-25	8	Installazione sanitari e rubinetterie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 18: verificare qualità dei materiali forniti oggi.	53
133	2026-02-26	8	Pulizia fine cantiere e smaltimento macerie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 19: verificare qualità dei materiali forniti oggi.	53
134	2026-02-27	8	Collaudo finale e consegna chiavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 20: verificare qualità dei materiali forniti oggi.	53
135	2026-03-12	11	Allestimento cantiere e scarico materiali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 1: verificare qualità dei materiali forniti oggi.	60
136	2026-03-13	11	Tracciamento impianti e scavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 2: verificare qualità dei materiali forniti oggi.	60
137	2026-03-14	11	Posa tubazioni scarico primarie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 3: verificare qualità dei materiali forniti oggi.	60
138	2026-03-15	11	Getto di pulizia e armatura	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 4: verificare qualità dei materiali forniti oggi.	60
139	2026-03-16	11	Chiusura tracce e verifica livelli	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 5: verificare qualità dei materiali forniti oggi.	60
140	2026-03-17	11	Inizio murature perimetrali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 6: verificare qualità dei materiali forniti oggi.	60
141	2026-03-18	11	Posa controtelai e soglie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 7: verificare qualità dei materiali forniti oggi.	60
142	2026-03-19	11	Intonacatura grezza piano terra	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 8: verificare qualità dei materiali forniti oggi.	60
143	2026-03-20	11	Impianto elettrico: posa corrugati	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 9: verificare qualità dei materiali forniti oggi.	60
144	2026-03-21	11	Verifica sicurezza e sopralluogo tecnico	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 10: verificare qualità dei materiali forniti oggi.	60
145	2026-03-22	11	Montaggio cartongessi e orditure	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 11: verificare qualità dei materiali forniti oggi.	60
146	2026-03-23	11	Rasatura pareti zona A	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 12: verificare qualità dei materiali forniti oggi.	60
147	2026-03-24	11	Posa massetto autolivellante	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 13: verificare qualità dei materiali forniti oggi.	60
148	2026-03-25	11	Installazione centralina idraulica	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 14: verificare qualità dei materiali forniti oggi.	60
149	2026-03-26	11	Posa pavimenti e rivestimenti	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 15: verificare qualità dei materiali forniti oggi.	60
150	2026-03-27	11	Montaggio infissi esterni	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 16: verificare qualità dei materiali forniti oggi.	60
151	2026-03-28	11	Pittura prima mano e finiture	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 17: verificare qualità dei materiali forniti oggi.	60
152	2026-03-29	11	Installazione sanitari e rubinetterie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 18: verificare qualità dei materiali forniti oggi.	60
153	2026-03-30	11	Pulizia fine cantiere e smaltimento macerie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 19: verificare qualità dei materiali forniti oggi.	60
154	2026-03-31	11	Collaudo finale e consegna chiavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 20: verificare qualità dei materiali forniti oggi.	60
155	2026-03-12	12	Allestimento cantiere e scarico materiali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 1: verificare qualità dei materiali forniti oggi.	67
156	2026-03-13	12	Tracciamento impianti e scavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 2: verificare qualità dei materiali forniti oggi.	67
157	2026-03-14	12	Posa tubazioni scarico primarie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 3: verificare qualità dei materiali forniti oggi.	67
158	2026-03-15	12	Getto di pulizia e armatura	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 4: verificare qualità dei materiali forniti oggi.	67
159	2026-03-16	12	Chiusura tracce e verifica livelli	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 5: verificare qualità dei materiali forniti oggi.	67
160	2026-03-17	12	Inizio murature perimetrali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 6: verificare qualità dei materiali forniti oggi.	67
161	2026-03-18	12	Posa controtelai e soglie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 7: verificare qualità dei materiali forniti oggi.	67
162	2026-03-19	12	Intonacatura grezza piano terra	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 8: verificare qualità dei materiali forniti oggi.	67
163	2026-03-20	12	Impianto elettrico: posa corrugati	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 9: verificare qualità dei materiali forniti oggi.	67
164	2026-03-21	12	Verifica sicurezza e sopralluogo tecnico	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 10: verificare qualità dei materiali forniti oggi.	67
165	2026-03-22	12	Montaggio cartongessi e orditure	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 11: verificare qualità dei materiali forniti oggi.	67
166	2026-03-23	12	Rasatura pareti zona A	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 12: verificare qualità dei materiali forniti oggi.	67
167	2026-03-24	12	Posa massetto autolivellante	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 13: verificare qualità dei materiali forniti oggi.	67
168	2026-03-25	12	Installazione centralina idraulica	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 14: verificare qualità dei materiali forniti oggi.	67
169	2026-03-26	12	Posa pavimenti e rivestimenti	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 15: verificare qualità dei materiali forniti oggi.	67
170	2026-03-27	12	Montaggio infissi esterni	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 16: verificare qualità dei materiali forniti oggi.	67
171	2026-03-28	12	Pittura prima mano e finiture	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 17: verificare qualità dei materiali forniti oggi.	67
172	2026-03-29	12	Installazione sanitari e rubinetterie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 18: verificare qualità dei materiali forniti oggi.	67
173	2026-03-30	12	Pulizia fine cantiere e smaltimento macerie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 19: verificare qualità dei materiali forniti oggi.	67
174	2026-03-31	12	Collaudo finale e consegna chiavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 20: verificare qualità dei materiali forniti oggi.	67
175	2026-03-25	21	Allestimento cantiere e scarico materiali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 1: verificare qualità dei materiali forniti oggi.	74
176	2026-03-26	21	Tracciamento impianti e scavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 2: verificare qualità dei materiali forniti oggi.	74
177	2026-03-27	21	Posa tubazioni scarico primarie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 3: verificare qualità dei materiali forniti oggi.	74
178	2026-03-28	21	Getto di pulizia e armatura	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 4: verificare qualità dei materiali forniti oggi.	74
179	2026-03-29	21	Chiusura tracce e verifica livelli	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 5: verificare qualità dei materiali forniti oggi.	74
180	2026-03-30	21	Inizio murature perimetrali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 6: verificare qualità dei materiali forniti oggi.	74
181	2026-03-31	21	Posa controtelai e soglie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 7: verificare qualità dei materiali forniti oggi.	74
182	2026-04-01	21	Intonacatura grezza piano terra	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 8: verificare qualità dei materiali forniti oggi.	74
183	2026-04-02	21	Impianto elettrico: posa corrugati	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 9: verificare qualità dei materiali forniti oggi.	74
184	2026-04-03	21	Verifica sicurezza e sopralluogo tecnico	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 10: verificare qualità dei materiali forniti oggi.	74
185	2026-04-04	21	Montaggio cartongessi e orditure	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 11: verificare qualità dei materiali forniti oggi.	74
186	2026-04-05	21	Rasatura pareti zona A	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 12: verificare qualità dei materiali forniti oggi.	74
187	2026-04-06	21	Posa massetto autolivellante	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 13: verificare qualità dei materiali forniti oggi.	74
188	2026-04-07	21	Installazione centralina idraulica	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 14: verificare qualità dei materiali forniti oggi.	74
189	2026-04-08	21	Posa pavimenti e rivestimenti	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 15: verificare qualità dei materiali forniti oggi.	74
190	2026-04-09	21	Montaggio infissi esterni	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 16: verificare qualità dei materiali forniti oggi.	74
191	2026-04-10	21	Pittura prima mano e finiture	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 17: verificare qualità dei materiali forniti oggi.	74
192	2026-04-11	21	Installazione sanitari e rubinetterie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 18: verificare qualità dei materiali forniti oggi.	74
193	2026-04-12	21	Pulizia fine cantiere e smaltimento macerie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 19: verificare qualità dei materiali forniti oggi.	74
194	2026-04-13	21	Collaudo finale e consegna chiavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 20: verificare qualità dei materiali forniti oggi.	74
195	2026-03-29	22	Allestimento cantiere e scarico materiali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 1: verificare qualità dei materiali forniti oggi.	81
196	2026-03-30	22	Tracciamento impianti e scavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 2: verificare qualità dei materiali forniti oggi.	81
197	2026-03-31	22	Posa tubazioni scarico primarie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 3: verificare qualità dei materiali forniti oggi.	81
198	2026-04-01	22	Getto di pulizia e armatura	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 4: verificare qualità dei materiali forniti oggi.	81
199	2026-04-02	22	Chiusura tracce e verifica livelli	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 5: verificare qualità dei materiali forniti oggi.	81
200	2026-04-03	22	Inizio murature perimetrali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 6: verificare qualità dei materiali forniti oggi.	81
201	2026-04-04	22	Posa controtelai e soglie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 7: verificare qualità dei materiali forniti oggi.	81
202	2026-04-05	22	Intonacatura grezza piano terra	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 8: verificare qualità dei materiali forniti oggi.	81
203	2026-04-06	22	Impianto elettrico: posa corrugati	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 9: verificare qualità dei materiali forniti oggi.	81
204	2026-04-07	22	Verifica sicurezza e sopralluogo tecnico	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 10: verificare qualità dei materiali forniti oggi.	81
205	2026-04-08	22	Montaggio cartongessi e orditure	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 11: verificare qualità dei materiali forniti oggi.	81
206	2026-04-09	22	Rasatura pareti zona A	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 12: verificare qualità dei materiali forniti oggi.	81
207	2026-04-10	22	Posa massetto autolivellante	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 13: verificare qualità dei materiali forniti oggi.	81
208	2026-04-11	22	Installazione centralina idraulica	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 14: verificare qualità dei materiali forniti oggi.	81
209	2026-04-12	22	Posa pavimenti e rivestimenti	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 15: verificare qualità dei materiali forniti oggi.	81
210	2026-04-13	22	Montaggio infissi esterni	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 16: verificare qualità dei materiali forniti oggi.	81
211	2026-04-14	22	Pittura prima mano e finiture	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 17: verificare qualità dei materiali forniti oggi.	81
212	2026-04-15	22	Installazione sanitari e rubinetterie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 18: verificare qualità dei materiali forniti oggi.	81
213	2026-04-16	22	Pulizia fine cantiere e smaltimento macerie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 19: verificare qualità dei materiali forniti oggi.	81
214	2026-04-17	22	Collaudo finale e consegna chiavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 20: verificare qualità dei materiali forniti oggi.	81
215	2026-05-31	21	\N	\N	dell'uno giugno	74
216	2026-06-09	21	\N	\N	123456789	74
217	2026-06-10	21	\N	\N	123456879	74
218	2026-06-22	21	\N	\N	22 giugno	74
219	2026-03-31	23	Allestimento cantiere e scarico materiali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 1: verificare qualità dei materiali forniti oggi.	88
220	2026-04-01	23	Tracciamento impianti e scavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 2: verificare qualità dei materiali forniti oggi.	88
221	2026-04-02	23	Posa tubazioni scarico primarie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 3: verificare qualità dei materiali forniti oggi.	88
222	2026-04-03	23	Getto di pulizia e armatura	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 4: verificare qualità dei materiali forniti oggi.	88
223	2026-04-04	23	Chiusura tracce e verifica livelli	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 5: verificare qualità dei materiali forniti oggi.	88
224	2026-04-05	23	Inizio murature perimetrali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 6: verificare qualità dei materiali forniti oggi.	88
225	2026-04-06	23	Posa controtelai e soglie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 7: verificare qualità dei materiali forniti oggi.	88
226	2026-04-07	23	Intonacatura grezza piano terra	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 8: verificare qualità dei materiali forniti oggi.	88
227	2026-04-08	23	Impianto elettrico: posa corrugati	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 9: verificare qualità dei materiali forniti oggi.	88
228	2026-04-09	23	Verifica sicurezza e sopralluogo tecnico	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 10: verificare qualità dei materiali forniti oggi.	88
229	2026-04-10	23	Montaggio cartongessi e orditure	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 11: verificare qualità dei materiali forniti oggi.	88
230	2026-04-11	23	Rasatura pareti zona A	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 12: verificare qualità dei materiali forniti oggi.	88
231	2026-04-12	23	Posa massetto autolivellante	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 13: verificare qualità dei materiali forniti oggi.	88
232	2026-04-13	23	Installazione centralina idraulica	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 14: verificare qualità dei materiali forniti oggi.	88
233	2026-04-14	23	Posa pavimenti e rivestimenti	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 15: verificare qualità dei materiali forniti oggi.	88
234	2026-04-15	23	Montaggio infissi esterni	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 16: verificare qualità dei materiali forniti oggi.	88
235	2026-04-16	23	Pittura prima mano e finiture	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 17: verificare qualità dei materiali forniti oggi.	88
236	2026-04-17	23	Installazione sanitari e rubinetterie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 18: verificare qualità dei materiali forniti oggi.	88
237	2026-04-18	23	Pulizia fine cantiere e smaltimento macerie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 19: verificare qualità dei materiali forniti oggi.	88
238	2026-04-19	23	Collaudo finale e consegna chiavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 20: verificare qualità dei materiali forniti oggi.	88
239	2026-03-31	24	Allestimento cantiere e scarico materiali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 1: verificare qualità dei materiali forniti oggi.	95
240	2026-04-01	24	Tracciamento impianti e scavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 2: verificare qualità dei materiali forniti oggi.	95
241	2026-04-02	24	Posa tubazioni scarico primarie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 3: verificare qualità dei materiali forniti oggi.	95
242	2026-04-03	24	Getto di pulizia e armatura	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 4: verificare qualità dei materiali forniti oggi.	95
243	2026-04-04	24	Chiusura tracce e verifica livelli	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 5: verificare qualità dei materiali forniti oggi.	95
244	2026-04-05	24	Inizio murature perimetrali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 6: verificare qualità dei materiali forniti oggi.	95
245	2026-04-06	24	Posa controtelai e soglie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 7: verificare qualità dei materiali forniti oggi.	95
246	2026-04-07	24	Intonacatura grezza piano terra	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 8: verificare qualità dei materiali forniti oggi.	95
247	2026-04-08	24	Impianto elettrico: posa corrugati	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 9: verificare qualità dei materiali forniti oggi.	95
248	2026-04-09	24	Verifica sicurezza e sopralluogo tecnico	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 10: verificare qualità dei materiali forniti oggi.	95
249	2026-04-10	24	Montaggio cartongessi e orditure	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 11: verificare qualità dei materiali forniti oggi.	95
250	2026-04-11	24	Rasatura pareti zona A	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 12: verificare qualità dei materiali forniti oggi.	95
251	2026-04-12	24	Posa massetto autolivellante	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 13: verificare qualità dei materiali forniti oggi.	95
252	2026-04-13	24	Installazione centralina idraulica	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 14: verificare qualità dei materiali forniti oggi.	95
253	2026-04-14	24	Posa pavimenti e rivestimenti	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 15: verificare qualità dei materiali forniti oggi.	95
254	2026-04-15	24	Montaggio infissi esterni	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 16: verificare qualità dei materiali forniti oggi.	95
255	2026-04-16	24	Pittura prima mano e finiture	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 17: verificare qualità dei materiali forniti oggi.	95
256	2026-04-17	24	Installazione sanitari e rubinetterie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 18: verificare qualità dei materiali forniti oggi.	95
257	2026-04-18	24	Pulizia fine cantiere e smaltimento macerie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 19: verificare qualità dei materiali forniti oggi.	95
258	2026-04-19	24	Collaudo finale e consegna chiavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 20: verificare qualità dei materiali forniti oggi.	95
259	2026-03-31	25	Allestimento cantiere e scarico materiali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 1: verificare qualità dei materiali forniti oggi.	102
260	2026-04-01	25	Tracciamento impianti e scavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 2: verificare qualità dei materiali forniti oggi.	102
261	2026-04-02	25	Posa tubazioni scarico primarie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 3: verificare qualità dei materiali forniti oggi.	102
262	2026-04-03	25	Getto di pulizia e armatura	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 4: verificare qualità dei materiali forniti oggi.	102
263	2026-04-04	25	Chiusura tracce e verifica livelli	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 5: verificare qualità dei materiali forniti oggi.	102
264	2026-04-05	25	Inizio murature perimetrali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 6: verificare qualità dei materiali forniti oggi.	102
265	2026-04-06	25	Posa controtelai e soglie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 7: verificare qualità dei materiali forniti oggi.	102
266	2026-04-07	25	Intonacatura grezza piano terra	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 8: verificare qualità dei materiali forniti oggi.	102
267	2026-04-08	25	Impianto elettrico: posa corrugati	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 9: verificare qualità dei materiali forniti oggi.	102
268	2026-04-09	25	Verifica sicurezza e sopralluogo tecnico	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 10: verificare qualità dei materiali forniti oggi.	102
269	2026-04-10	25	Montaggio cartongessi e orditure	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 11: verificare qualità dei materiali forniti oggi.	102
270	2026-04-11	25	Rasatura pareti zona A	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 12: verificare qualità dei materiali forniti oggi.	102
271	2026-04-12	25	Posa massetto autolivellante	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 13: verificare qualità dei materiali forniti oggi.	102
272	2026-04-13	25	Installazione centralina idraulica	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 14: verificare qualità dei materiali forniti oggi.	102
273	2026-04-14	25	Posa pavimenti e rivestimenti	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 15: verificare qualità dei materiali forniti oggi.	102
274	2026-04-15	25	Montaggio infissi esterni	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 16: verificare qualità dei materiali forniti oggi.	102
275	2026-04-16	25	Pittura prima mano e finiture	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 17: verificare qualità dei materiali forniti oggi.	102
276	2026-04-17	25	Installazione sanitari e rubinetterie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 18: verificare qualità dei materiali forniti oggi.	102
277	2026-04-18	25	Pulizia fine cantiere e smaltimento macerie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 19: verificare qualità dei materiali forniti oggi.	102
278	2026-04-19	25	Collaudo finale e consegna chiavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 20: verificare qualità dei materiali forniti oggi.	102
299	2026-03-31	27	Allestimento cantiere e scarico materiali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 1: verificare qualità dei materiali forniti oggi.	116
300	2026-04-01	27	Tracciamento impianti e scavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 2: verificare qualità dei materiali forniti oggi.	116
301	2026-04-02	27	Posa tubazioni scarico primarie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 3: verificare qualità dei materiali forniti oggi.	116
302	2026-04-03	27	Getto di pulizia e armatura	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 4: verificare qualità dei materiali forniti oggi.	116
303	2026-04-04	27	Chiusura tracce e verifica livelli	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 5: verificare qualità dei materiali forniti oggi.	116
304	2026-04-05	27	Inizio murature perimetrali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 6: verificare qualità dei materiali forniti oggi.	116
305	2026-04-06	27	Posa controtelai e soglie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 7: verificare qualità dei materiali forniti oggi.	116
306	2026-04-07	27	Intonacatura grezza piano terra	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 8: verificare qualità dei materiali forniti oggi.	116
307	2026-04-08	27	Impianto elettrico: posa corrugati	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 9: verificare qualità dei materiali forniti oggi.	116
308	2026-04-09	27	Verifica sicurezza e sopralluogo tecnico	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 10: verificare qualità dei materiali forniti oggi.	116
309	2026-04-10	27	Montaggio cartongessi e orditure	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 11: verificare qualità dei materiali forniti oggi.	116
310	2026-04-11	27	Rasatura pareti zona A	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 12: verificare qualità dei materiali forniti oggi.	116
311	2026-04-12	27	Posa massetto autolivellante	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 13: verificare qualità dei materiali forniti oggi.	116
312	2026-04-13	27	Installazione centralina idraulica	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 14: verificare qualità dei materiali forniti oggi.	116
313	2026-04-14	27	Posa pavimenti e rivestimenti	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 15: verificare qualità dei materiali forniti oggi.	116
314	2026-04-15	27	Montaggio infissi esterni	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 16: verificare qualità dei materiali forniti oggi.	116
315	2026-04-16	27	Pittura prima mano e finiture	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 17: verificare qualità dei materiali forniti oggi.	116
316	2026-04-17	27	Installazione sanitari e rubinetterie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 18: verificare qualità dei materiali forniti oggi.	116
317	2026-04-18	27	Pulizia fine cantiere e smaltimento macerie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 19: verificare qualità dei materiali forniti oggi.	116
318	2026-04-19	27	Collaudo finale e consegna chiavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 20: verificare qualità dei materiali forniti oggi.	116
319	2026-03-31	28	Allestimento cantiere e scarico materiali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 1: verificare qualità dei materiali forniti oggi.	123
320	2026-04-01	28	Tracciamento impianti e scavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 2: verificare qualità dei materiali forniti oggi.	123
321	2026-04-02	28	Posa tubazioni scarico primarie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 3: verificare qualità dei materiali forniti oggi.	123
322	2026-04-03	28	Getto di pulizia e armatura	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 4: verificare qualità dei materiali forniti oggi.	123
323	2026-04-04	28	Chiusura tracce e verifica livelli	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 5: verificare qualità dei materiali forniti oggi.	123
324	2026-04-05	28	Inizio murature perimetrali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 6: verificare qualità dei materiali forniti oggi.	123
325	2026-04-06	28	Posa controtelai e soglie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 7: verificare qualità dei materiali forniti oggi.	123
326	2026-04-07	28	Intonacatura grezza piano terra	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 8: verificare qualità dei materiali forniti oggi.	123
327	2026-04-08	28	Impianto elettrico: posa corrugati	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 9: verificare qualità dei materiali forniti oggi.	123
328	2026-04-09	28	Verifica sicurezza e sopralluogo tecnico	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 10: verificare qualità dei materiali forniti oggi.	123
329	2026-04-10	28	Montaggio cartongessi e orditure	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 11: verificare qualità dei materiali forniti oggi.	123
330	2026-04-11	28	Rasatura pareti zona A	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 12: verificare qualità dei materiali forniti oggi.	123
331	2026-04-12	28	Posa massetto autolivellante	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 13: verificare qualità dei materiali forniti oggi.	123
332	2026-04-13	28	Installazione centralina idraulica	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 14: verificare qualità dei materiali forniti oggi.	123
333	2026-04-14	28	Posa pavimenti e rivestimenti	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 15: verificare qualità dei materiali forniti oggi.	123
334	2026-04-15	28	Montaggio infissi esterni	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 16: verificare qualità dei materiali forniti oggi.	123
335	2026-04-16	28	Pittura prima mano e finiture	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 17: verificare qualità dei materiali forniti oggi.	123
336	2026-04-17	28	Installazione sanitari e rubinetterie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 18: verificare qualità dei materiali forniti oggi.	123
337	2026-04-18	28	Pulizia fine cantiere e smaltimento macerie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 19: verificare qualità dei materiali forniti oggi.	123
338	2026-04-19	28	Collaudo finale e consegna chiavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 20: verificare qualità dei materiali forniti oggi.	123
339	2026-03-31	29	Allestimento cantiere e scarico materiali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 1: verificare qualità dei materiali forniti oggi.	130
340	2026-04-01	29	Tracciamento impianti e scavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 2: verificare qualità dei materiali forniti oggi.	130
341	2026-04-02	29	Posa tubazioni scarico primarie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 3: verificare qualità dei materiali forniti oggi.	130
342	2026-04-03	29	Getto di pulizia e armatura	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 4: verificare qualità dei materiali forniti oggi.	130
343	2026-04-04	29	Chiusura tracce e verifica livelli	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 5: verificare qualità dei materiali forniti oggi.	130
344	2026-04-05	29	Inizio murature perimetrali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 6: verificare qualità dei materiali forniti oggi.	130
345	2026-04-06	29	Posa controtelai e soglie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 7: verificare qualità dei materiali forniti oggi.	130
346	2026-04-07	29	Intonacatura grezza piano terra	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 8: verificare qualità dei materiali forniti oggi.	130
347	2026-04-08	29	Impianto elettrico: posa corrugati	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 9: verificare qualità dei materiali forniti oggi.	130
348	2026-04-09	29	Verifica sicurezza e sopralluogo tecnico	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 10: verificare qualità dei materiali forniti oggi.	130
349	2026-04-10	29	Montaggio cartongessi e orditure	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 11: verificare qualità dei materiali forniti oggi.	130
350	2026-04-11	29	Rasatura pareti zona A	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 12: verificare qualità dei materiali forniti oggi.	130
351	2026-04-12	29	Posa massetto autolivellante	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 13: verificare qualità dei materiali forniti oggi.	130
352	2026-04-13	29	Installazione centralina idraulica	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 14: verificare qualità dei materiali forniti oggi.	130
353	2026-04-14	29	Posa pavimenti e rivestimenti	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 15: verificare qualità dei materiali forniti oggi.	130
354	2026-04-15	29	Montaggio infissi esterni	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 16: verificare qualità dei materiali forniti oggi.	130
355	2026-04-16	29	Pittura prima mano e finiture	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 17: verificare qualità dei materiali forniti oggi.	130
356	2026-04-17	29	Installazione sanitari e rubinetterie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 18: verificare qualità dei materiali forniti oggi.	130
357	2026-04-18	29	Pulizia fine cantiere e smaltimento macerie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 19: verificare qualità dei materiali forniti oggi.	130
358	2026-04-19	29	Collaudo finale e consegna chiavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 20: verificare qualità dei materiali forniti oggi.	130
359	2026-03-31	30	Allestimento cantiere e scarico materiali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 1: verificare qualità dei materiali forniti oggi.	137
360	2026-04-01	30	Tracciamento impianti e scavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 2: verificare qualità dei materiali forniti oggi.	137
361	2026-04-02	30	Posa tubazioni scarico primarie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 3: verificare qualità dei materiali forniti oggi.	137
362	2026-04-03	30	Getto di pulizia e armatura	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 4: verificare qualità dei materiali forniti oggi.	137
363	2026-04-04	30	Chiusura tracce e verifica livelli	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 5: verificare qualità dei materiali forniti oggi.	137
364	2026-04-05	30	Inizio murature perimetrali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 6: verificare qualità dei materiali forniti oggi.	137
365	2026-04-06	30	Posa controtelai e soglie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 7: verificare qualità dei materiali forniti oggi.	137
366	2026-04-07	30	Intonacatura grezza piano terra	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 8: verificare qualità dei materiali forniti oggi.	137
367	2026-04-08	30	Impianto elettrico: posa corrugati	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 9: verificare qualità dei materiali forniti oggi.	137
368	2026-04-09	30	Verifica sicurezza e sopralluogo tecnico	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 10: verificare qualità dei materiali forniti oggi.	137
369	2026-04-10	30	Montaggio cartongessi e orditure	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 11: verificare qualità dei materiali forniti oggi.	137
370	2026-04-11	30	Rasatura pareti zona A	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 12: verificare qualità dei materiali forniti oggi.	137
371	2026-04-12	30	Posa massetto autolivellante	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 13: verificare qualità dei materiali forniti oggi.	137
372	2026-04-13	30	Installazione centralina idraulica	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 14: verificare qualità dei materiali forniti oggi.	137
373	2026-04-14	30	Posa pavimenti e rivestimenti	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 15: verificare qualità dei materiali forniti oggi.	137
374	2026-04-15	30	Montaggio infissi esterni	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 16: verificare qualità dei materiali forniti oggi.	137
375	2026-04-16	30	Pittura prima mano e finiture	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 17: verificare qualità dei materiali forniti oggi.	137
376	2026-04-17	30	Installazione sanitari e rubinetterie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 18: verificare qualità dei materiali forniti oggi.	137
377	2026-04-18	30	Pulizia fine cantiere e smaltimento macerie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 19: verificare qualità dei materiali forniti oggi.	137
378	2026-04-19	30	Collaudo finale e consegna chiavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 20: verificare qualità dei materiali forniti oggi.	137
379	2026-04-01	34	Allestimento cantiere e scarico materiali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 1: verificare qualità dei materiali forniti oggi.	145
380	2026-04-01	33	Allestimento cantiere e scarico materiali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 1: verificare qualità dei materiali forniti oggi.	144
381	2026-04-02	34	Tracciamento impianti e scavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 2: verificare qualità dei materiali forniti oggi.	145
382	2026-04-02	33	Tracciamento impianti e scavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 2: verificare qualità dei materiali forniti oggi.	144
383	2026-04-03	34	Posa tubazioni scarico primarie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 3: verificare qualità dei materiali forniti oggi.	145
384	2026-04-03	33	Posa tubazioni scarico primarie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 3: verificare qualità dei materiali forniti oggi.	144
385	2026-04-04	34	Getto di pulizia e armatura	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 4: verificare qualità dei materiali forniti oggi.	145
386	2026-04-04	33	Getto di pulizia e armatura	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 4: verificare qualità dei materiali forniti oggi.	144
387	2026-04-05	34	Chiusura tracce e verifica livelli	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 5: verificare qualità dei materiali forniti oggi.	145
388	2026-04-05	33	Chiusura tracce e verifica livelli	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 5: verificare qualità dei materiali forniti oggi.	144
389	2026-04-06	34	Inizio murature perimetrali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 6: verificare qualità dei materiali forniti oggi.	145
390	2026-04-06	33	Inizio murature perimetrali	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 6: verificare qualità dei materiali forniti oggi.	144
391	2026-04-07	34	Posa controtelai e soglie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 7: verificare qualità dei materiali forniti oggi.	145
392	2026-04-07	33	Posa controtelai e soglie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 7: verificare qualità dei materiali forniti oggi.	144
394	2026-04-08	33	Intonacatura grezza piano terra	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 8: verificare qualità dei materiali forniti oggi.	144
396	2026-04-09	33	Impianto elettrico: posa corrugati	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 9: verificare qualità dei materiali forniti oggi.	144
398	2026-04-10	33	Verifica sicurezza e sopralluogo tecnico	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 10: verificare qualità dei materiali forniti oggi.	144
401	2026-04-11	33	Montaggio cartongessi e orditure	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 11: verificare qualità dei materiali forniti oggi.	144
403	2026-04-12	33	Rasatura pareti zona A	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 12: verificare qualità dei materiali forniti oggi.	144
405	2026-04-13	33	Posa massetto autolivellante	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 13: verificare qualità dei materiali forniti oggi.	144
407	2026-04-14	33	Installazione centralina idraulica	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 14: verificare qualità dei materiali forniti oggi.	144
409	2026-04-15	33	Posa pavimenti e rivestimenti	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 15: verificare qualità dei materiali forniti oggi.	144
411	2026-04-16	33	Montaggio infissi esterni	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 16: verificare qualità dei materiali forniti oggi.	144
413	2026-04-17	33	Pittura prima mano e finiture	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 17: verificare qualità dei materiali forniti oggi.	144
415	2026-04-18	33	Installazione sanitari e rubinetterie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 18: verificare qualità dei materiali forniti oggi.	144
417	2026-04-19	33	Pulizia fine cantiere e smaltimento macerie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 19: verificare qualità dei materiali forniti oggi.	144
418	2026-04-20	33	Collaudo finale e consegna chiavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 20: verificare qualità dei materiali forniti oggi.	144
393	2026-04-08	34	Intonacatura grezza piano terra	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 8: verificare qualità dei materiali forniti oggi.	145
395	2026-04-09	34	Impianto elettrico: posa corrugati	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 9: verificare qualità dei materiali forniti oggi.	145
397	2026-04-10	34	Verifica sicurezza e sopralluogo tecnico	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 10: verificare qualità dei materiali forniti oggi.	145
399	2026-04-11	34	Montaggio cartongessi e orditure	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 11: verificare qualità dei materiali forniti oggi.	145
400	2026-04-12	34	Rasatura pareti zona A	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 12: verificare qualità dei materiali forniti oggi.	145
402	2026-04-13	34	Posa massetto autolivellante	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 13: verificare qualità dei materiali forniti oggi.	145
404	2026-04-14	34	Installazione centralina idraulica	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 14: verificare qualità dei materiali forniti oggi.	145
406	2026-04-15	34	Posa pavimenti e rivestimenti	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 15: verificare qualità dei materiali forniti oggi.	145
408	2026-04-16	34	Montaggio infissi esterni	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 16: verificare qualità dei materiali forniti oggi.	145
410	2026-04-17	34	Pittura prima mano e finiture	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 17: verificare qualità dei materiali forniti oggi.	145
412	2026-04-18	34	Installazione sanitari e rubinetterie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 18: verificare qualità dei materiali forniti oggi.	145
414	2026-04-19	34	Pulizia fine cantiere e smaltimento macerie	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 19: verificare qualità dei materiali forniti oggi.	145
416	2026-04-20	34	Collaudo finale e consegna chiavi	Meteo sereno, forniture arrivate in orario.	Nota privata giorno 20: verificare qualità dei materiali forniti oggi.	145
\.


--
-- Data for Name: daily_presences; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.daily_presences (id, building_site_id, user_id, date, is_present, notes, owner_id) FROM stdin;
1	2	12	2026-02-01	present	\N	11
2	2	13	2026-02-01	present	\N	11
3	2	14	2026-02-01	present	\N	11
4	2	15	2026-02-01	present	\N	11
5	2	16	2026-02-01	present	\N	11
6	2	17	2026-02-01	present	\N	11
7	2	12	2026-02-02	present	\N	11
8	2	13	2026-02-02	present	\N	11
9	2	14	2026-02-02	present	\N	11
10	2	15	2026-02-02	present	\N	11
11	2	16	2026-02-02	present	\N	11
12	2	17	2026-02-02	present	\N	11
13	2	12	2026-02-03	present	\N	11
14	2	13	2026-02-03	present	\N	11
15	2	14	2026-02-03	present	\N	11
16	2	15	2026-02-03	present	\N	11
17	2	16	2026-02-03	present	\N	11
18	2	17	2026-02-03	present	\N	11
19	2	12	2026-02-04	present	\N	11
20	2	13	2026-02-04	present	\N	11
21	2	14	2026-02-04	present	\N	11
22	2	15	2026-02-04	present	\N	11
23	2	16	2026-02-04	present	\N	11
24	2	17	2026-02-04	present	\N	11
25	2	12	2026-02-05	present	\N	11
26	2	13	2026-02-05	present	\N	11
27	2	14	2026-02-05	present	\N	11
28	2	15	2026-02-05	present	\N	11
29	2	16	2026-02-05	present	\N	11
30	2	17	2026-02-05	present	\N	11
31	2	12	2026-02-06	present	\N	11
32	2	13	2026-02-06	present	\N	11
33	2	14	2026-02-06	present	\N	11
34	2	15	2026-02-06	present	\N	11
35	2	16	2026-02-06	present	\N	11
36	2	17	2026-02-06	present	\N	11
37	2	12	2026-02-07	present	\N	11
38	2	13	2026-02-07	present	\N	11
39	2	14	2026-02-07	present	\N	11
40	2	15	2026-02-07	present	\N	11
41	2	16	2026-02-07	present	\N	11
42	2	17	2026-02-07	present	\N	11
43	2	12	2026-02-08	present	\N	11
44	2	13	2026-02-08	present	\N	11
45	2	14	2026-02-08	present	\N	11
46	2	15	2026-02-08	present	\N	11
47	2	16	2026-02-08	present	\N	11
48	2	17	2026-02-08	present	\N	11
49	2	12	2026-02-09	present	\N	11
50	2	13	2026-02-09	present	\N	11
51	2	14	2026-02-09	present	\N	11
52	2	15	2026-02-09	present	\N	11
53	2	16	2026-02-09	present	\N	11
54	2	17	2026-02-09	present	\N	11
55	2	12	2026-02-10	present	\N	11
56	2	13	2026-02-10	present	\N	11
57	2	14	2026-02-10	present	\N	11
58	2	15	2026-02-10	present	\N	11
59	2	16	2026-02-10	present	\N	11
60	2	17	2026-02-10	present	\N	11
61	3	19	2026-02-01	present	\N	18
62	3	20	2026-02-01	present	\N	18
63	3	21	2026-02-01	present	\N	18
64	3	22	2026-02-01	present	\N	18
65	3	23	2026-02-01	present	\N	18
66	3	24	2026-02-01	present	\N	18
67	3	19	2026-02-02	present	\N	18
68	3	20	2026-02-02	present	\N	18
69	3	21	2026-02-02	present	\N	18
70	3	22	2026-02-02	present	\N	18
71	3	23	2026-02-02	present	\N	18
72	3	24	2026-02-02	present	\N	18
73	3	19	2026-02-03	present	\N	18
74	3	20	2026-02-03	present	\N	18
75	3	21	2026-02-03	present	\N	18
76	3	22	2026-02-03	present	\N	18
77	3	23	2026-02-03	present	\N	18
78	3	24	2026-02-03	present	\N	18
79	3	19	2026-02-04	present	\N	18
80	3	20	2026-02-04	present	\N	18
81	3	21	2026-02-04	present	\N	18
82	3	22	2026-02-04	present	\N	18
83	3	23	2026-02-04	present	\N	18
84	3	24	2026-02-04	present	\N	18
85	3	19	2026-02-05	present	\N	18
86	3	20	2026-02-05	present	\N	18
87	3	21	2026-02-05	present	\N	18
88	3	22	2026-02-05	present	\N	18
89	3	23	2026-02-05	present	\N	18
90	3	24	2026-02-05	present	\N	18
91	3	19	2026-02-06	present	\N	18
92	3	20	2026-02-06	present	\N	18
93	3	21	2026-02-06	present	\N	18
94	3	22	2026-02-06	present	\N	18
95	3	23	2026-02-06	present	\N	18
96	3	24	2026-02-06	present	\N	18
97	3	19	2026-02-07	present	\N	18
98	3	20	2026-02-07	present	\N	18
99	3	21	2026-02-07	present	\N	18
100	3	22	2026-02-07	present	\N	18
101	3	23	2026-02-07	present	\N	18
102	3	24	2026-02-07	present	\N	18
103	3	19	2026-02-08	present	\N	18
104	3	20	2026-02-08	present	\N	18
105	3	21	2026-02-08	present	\N	18
106	3	22	2026-02-08	present	\N	18
107	3	23	2026-02-08	present	\N	18
108	3	24	2026-02-08	present	\N	18
109	3	19	2026-02-09	present	\N	18
110	3	20	2026-02-09	present	\N	18
111	3	21	2026-02-09	present	\N	18
112	3	22	2026-02-09	present	\N	18
113	3	23	2026-02-09	present	\N	18
114	3	24	2026-02-09	present	\N	18
115	3	19	2026-02-10	present	\N	18
116	3	20	2026-02-10	present	\N	18
117	3	21	2026-02-10	present	\N	18
118	3	22	2026-02-10	present	\N	18
119	3	23	2026-02-10	present	\N	18
120	3	24	2026-02-10	present	\N	18
121	3	19	2026-02-11	present	\N	18
122	3	20	2026-02-11	present	\N	18
123	3	21	2026-02-11	present	\N	18
124	3	22	2026-02-11	present	\N	18
125	3	23	2026-02-11	present	\N	18
126	3	24	2026-02-11	present	\N	18
127	3	19	2026-02-12	present	\N	18
128	3	20	2026-02-12	present	\N	18
129	3	21	2026-02-12	present	\N	18
130	3	22	2026-02-12	present	\N	18
131	3	23	2026-02-12	present	\N	18
132	3	24	2026-02-12	present	\N	18
133	3	19	2026-02-13	present	\N	18
134	3	20	2026-02-13	present	\N	18
135	3	21	2026-02-13	present	\N	18
136	3	22	2026-02-13	present	\N	18
137	3	23	2026-02-13	present	\N	18
138	3	24	2026-02-13	present	\N	18
139	3	19	2026-02-14	present	\N	18
140	3	20	2026-02-14	present	\N	18
141	3	21	2026-02-14	present	\N	18
142	3	22	2026-02-14	present	\N	18
143	3	23	2026-02-14	present	\N	18
144	3	24	2026-02-14	present	\N	18
145	3	19	2026-02-15	present	\N	18
146	3	20	2026-02-15	present	\N	18
147	3	21	2026-02-15	present	\N	18
148	3	22	2026-02-15	present	\N	18
149	3	23	2026-02-15	present	\N	18
150	3	24	2026-02-15	present	\N	18
151	3	19	2026-02-16	present	\N	18
152	3	20	2026-02-16	present	\N	18
153	3	21	2026-02-16	present	\N	18
154	3	22	2026-02-16	present	\N	18
155	3	23	2026-02-16	present	\N	18
156	3	24	2026-02-16	present	\N	18
157	3	19	2026-02-17	present	\N	18
158	3	20	2026-02-17	present	\N	18
159	3	21	2026-02-17	present	\N	18
160	3	22	2026-02-17	present	\N	18
161	3	23	2026-02-17	present	\N	18
162	3	24	2026-02-17	present	\N	18
163	3	19	2026-02-18	present	\N	18
164	3	20	2026-02-18	present	\N	18
165	3	21	2026-02-18	present	\N	18
166	3	22	2026-02-18	present	\N	18
167	3	23	2026-02-18	present	\N	18
168	3	24	2026-02-18	present	\N	18
169	3	19	2026-02-19	present	\N	18
170	3	20	2026-02-19	present	\N	18
171	3	21	2026-02-19	present	\N	18
172	3	22	2026-02-19	present	\N	18
173	3	23	2026-02-19	present	\N	18
174	3	24	2026-02-19	present	\N	18
175	3	19	2026-02-20	present	\N	18
176	3	20	2026-02-20	present	\N	18
177	3	21	2026-02-20	present	\N	18
178	3	22	2026-02-20	present	\N	18
179	3	23	2026-02-20	present	\N	18
180	3	24	2026-02-20	present	\N	18
181	4	26	2026-02-01	present	\N	25
182	4	27	2026-02-01	present	\N	25
183	4	28	2026-02-01	present	\N	25
184	4	29	2026-02-01	present	\N	25
185	4	30	2026-02-01	present	\N	25
186	4	31	2026-02-01	present	\N	25
187	4	26	2026-02-02	present	\N	25
188	4	27	2026-02-02	present	\N	25
189	4	28	2026-02-02	present	\N	25
190	4	29	2026-02-02	present	\N	25
191	4	30	2026-02-02	present	\N	25
192	4	31	2026-02-02	present	\N	25
193	4	26	2026-02-03	present	\N	25
194	4	27	2026-02-03	present	\N	25
195	4	28	2026-02-03	present	\N	25
196	4	29	2026-02-03	present	\N	25
197	4	30	2026-02-03	present	\N	25
198	4	31	2026-02-03	present	\N	25
199	4	26	2026-02-04	present	\N	25
200	4	27	2026-02-04	present	\N	25
201	4	28	2026-02-04	present	\N	25
202	4	29	2026-02-04	present	\N	25
203	4	30	2026-02-04	present	\N	25
204	4	31	2026-02-04	present	\N	25
205	4	26	2026-02-05	present	\N	25
206	4	27	2026-02-05	present	\N	25
207	4	28	2026-02-05	present	\N	25
208	4	29	2026-02-05	present	\N	25
209	4	30	2026-02-05	present	\N	25
210	4	31	2026-02-05	present	\N	25
211	4	26	2026-02-06	present	\N	25
212	4	27	2026-02-06	present	\N	25
213	4	28	2026-02-06	present	\N	25
214	4	29	2026-02-06	present	\N	25
215	4	30	2026-02-06	present	\N	25
216	4	31	2026-02-06	present	\N	25
217	4	26	2026-02-07	present	\N	25
218	4	27	2026-02-07	present	\N	25
219	4	28	2026-02-07	present	\N	25
220	4	29	2026-02-07	present	\N	25
221	4	30	2026-02-07	present	\N	25
222	4	31	2026-02-07	present	\N	25
223	4	26	2026-02-08	present	\N	25
224	4	27	2026-02-08	present	\N	25
225	4	28	2026-02-08	present	\N	25
226	4	29	2026-02-08	present	\N	25
227	4	30	2026-02-08	present	\N	25
228	4	31	2026-02-08	present	\N	25
229	4	26	2026-02-09	present	\N	25
230	4	27	2026-02-09	present	\N	25
231	4	28	2026-02-09	present	\N	25
232	4	29	2026-02-09	present	\N	25
233	4	30	2026-02-09	present	\N	25
234	4	31	2026-02-09	present	\N	25
235	4	26	2026-02-10	present	\N	25
236	4	27	2026-02-10	present	\N	25
237	4	28	2026-02-10	present	\N	25
238	4	29	2026-02-10	present	\N	25
239	4	30	2026-02-10	present	\N	25
240	4	31	2026-02-10	present	\N	25
241	4	26	2026-02-11	present	\N	25
242	4	27	2026-02-11	present	\N	25
243	4	28	2026-02-11	present	\N	25
244	4	29	2026-02-11	present	\N	25
245	4	30	2026-02-11	present	\N	25
246	4	31	2026-02-11	present	\N	25
247	4	26	2026-02-12	present	\N	25
248	4	27	2026-02-12	present	\N	25
249	4	28	2026-02-12	present	\N	25
250	4	29	2026-02-12	present	\N	25
251	4	30	2026-02-12	present	\N	25
252	4	31	2026-02-12	present	\N	25
253	4	26	2026-02-13	present	\N	25
254	4	27	2026-02-13	present	\N	25
255	4	28	2026-02-13	present	\N	25
256	4	29	2026-02-13	present	\N	25
257	4	30	2026-02-13	present	\N	25
258	4	31	2026-02-13	present	\N	25
259	4	26	2026-02-14	present	\N	25
260	4	27	2026-02-14	present	\N	25
261	4	28	2026-02-14	present	\N	25
262	4	29	2026-02-14	present	\N	25
263	4	30	2026-02-14	present	\N	25
264	4	31	2026-02-14	present	\N	25
265	4	26	2026-02-15	present	\N	25
266	4	27	2026-02-15	present	\N	25
267	4	28	2026-02-15	present	\N	25
268	4	29	2026-02-15	present	\N	25
269	4	30	2026-02-15	present	\N	25
270	4	31	2026-02-15	present	\N	25
271	4	26	2026-02-16	present	\N	25
272	4	27	2026-02-16	present	\N	25
273	4	28	2026-02-16	present	\N	25
274	4	29	2026-02-16	present	\N	25
275	4	30	2026-02-16	present	\N	25
276	4	31	2026-02-16	present	\N	25
277	4	26	2026-02-17	present	\N	25
278	4	27	2026-02-17	present	\N	25
279	4	28	2026-02-17	present	\N	25
280	4	29	2026-02-17	present	\N	25
281	4	30	2026-02-17	present	\N	25
282	4	31	2026-02-17	present	\N	25
283	4	26	2026-02-18	present	\N	25
284	4	27	2026-02-18	present	\N	25
285	4	28	2026-02-18	present	\N	25
286	4	29	2026-02-18	present	\N	25
287	4	30	2026-02-18	present	\N	25
288	4	31	2026-02-18	present	\N	25
289	4	26	2026-02-19	present	\N	25
290	4	27	2026-02-19	present	\N	25
291	4	28	2026-02-19	present	\N	25
292	4	29	2026-02-19	present	\N	25
293	4	30	2026-02-19	present	\N	25
294	4	31	2026-02-19	present	\N	25
295	4	26	2026-02-20	present	\N	25
296	4	27	2026-02-20	present	\N	25
297	4	28	2026-02-20	present	\N	25
298	4	29	2026-02-20	present	\N	25
299	4	30	2026-02-20	present	\N	25
300	4	31	2026-02-20	present	\N	25
301	5	33	2026-02-01	present	\N	32
302	5	34	2026-02-01	present	\N	32
303	5	35	2026-02-01	present	\N	32
304	5	36	2026-02-01	present	\N	32
305	5	37	2026-02-01	present	\N	32
306	5	38	2026-02-01	present	\N	32
307	5	33	2026-02-02	present	\N	32
308	5	34	2026-02-02	present	\N	32
309	5	35	2026-02-02	present	\N	32
310	5	36	2026-02-02	present	\N	32
311	5	37	2026-02-02	present	\N	32
312	5	38	2026-02-02	present	\N	32
313	5	33	2026-02-03	present	\N	32
314	5	34	2026-02-03	present	\N	32
315	5	35	2026-02-03	present	\N	32
316	5	36	2026-02-03	present	\N	32
317	5	37	2026-02-03	present	\N	32
318	5	38	2026-02-03	present	\N	32
319	5	33	2026-02-04	present	\N	32
320	5	34	2026-02-04	present	\N	32
321	5	35	2026-02-04	present	\N	32
322	5	36	2026-02-04	present	\N	32
323	5	37	2026-02-04	present	\N	32
324	5	38	2026-02-04	present	\N	32
325	5	33	2026-02-05	present	\N	32
326	5	34	2026-02-05	present	\N	32
327	5	35	2026-02-05	present	\N	32
328	5	36	2026-02-05	present	\N	32
329	5	37	2026-02-05	present	\N	32
330	5	38	2026-02-05	present	\N	32
331	5	33	2026-02-06	present	\N	32
332	5	34	2026-02-06	present	\N	32
333	5	35	2026-02-06	present	\N	32
334	5	36	2026-02-06	present	\N	32
335	5	37	2026-02-06	present	\N	32
336	5	38	2026-02-06	present	\N	32
337	5	33	2026-02-07	present	\N	32
338	5	34	2026-02-07	present	\N	32
339	5	35	2026-02-07	present	\N	32
340	5	36	2026-02-07	present	\N	32
341	5	37	2026-02-07	present	\N	32
342	5	38	2026-02-07	present	\N	32
343	5	33	2026-02-08	present	\N	32
344	5	34	2026-02-08	present	\N	32
345	5	35	2026-02-08	present	\N	32
346	5	36	2026-02-08	present	\N	32
347	5	37	2026-02-08	present	\N	32
348	5	38	2026-02-08	present	\N	32
349	5	33	2026-02-09	present	\N	32
350	5	34	2026-02-09	present	\N	32
351	5	35	2026-02-09	present	\N	32
352	5	36	2026-02-09	present	\N	32
353	5	37	2026-02-09	present	\N	32
354	5	38	2026-02-09	present	\N	32
355	5	33	2026-02-10	present	\N	32
356	5	34	2026-02-10	present	\N	32
357	5	35	2026-02-10	present	\N	32
358	5	36	2026-02-10	present	\N	32
359	5	37	2026-02-10	present	\N	32
360	5	38	2026-02-10	present	\N	32
361	5	33	2026-02-11	present	\N	32
362	5	34	2026-02-11	present	\N	32
363	5	35	2026-02-11	present	\N	32
364	5	36	2026-02-11	present	\N	32
365	5	37	2026-02-11	present	\N	32
366	5	38	2026-02-11	present	\N	32
367	5	33	2026-02-12	present	\N	32
368	5	34	2026-02-12	present	\N	32
369	5	35	2026-02-12	present	\N	32
370	5	36	2026-02-12	present	\N	32
371	5	37	2026-02-12	present	\N	32
372	5	38	2026-02-12	present	\N	32
373	5	33	2026-02-13	present	\N	32
374	5	34	2026-02-13	present	\N	32
375	5	35	2026-02-13	present	\N	32
376	5	36	2026-02-13	present	\N	32
377	5	37	2026-02-13	present	\N	32
378	5	38	2026-02-13	present	\N	32
379	5	33	2026-02-14	present	\N	32
380	5	34	2026-02-14	present	\N	32
381	5	35	2026-02-14	present	\N	32
382	5	36	2026-02-14	present	\N	32
383	5	37	2026-02-14	present	\N	32
384	5	38	2026-02-14	present	\N	32
385	5	33	2026-02-15	present	\N	32
386	5	34	2026-02-15	present	\N	32
387	5	35	2026-02-15	present	\N	32
388	5	36	2026-02-15	present	\N	32
389	5	37	2026-02-15	present	\N	32
390	5	38	2026-02-15	present	\N	32
391	5	33	2026-02-16	present	\N	32
392	5	34	2026-02-16	present	\N	32
393	5	35	2026-02-16	present	\N	32
394	5	36	2026-02-16	present	\N	32
395	5	37	2026-02-16	present	\N	32
396	5	38	2026-02-16	present	\N	32
397	5	33	2026-02-17	present	\N	32
398	5	34	2026-02-17	present	\N	32
399	5	35	2026-02-17	present	\N	32
400	5	36	2026-02-17	present	\N	32
401	5	37	2026-02-17	present	\N	32
402	5	38	2026-02-17	present	\N	32
403	5	33	2026-02-18	present	\N	32
404	5	34	2026-02-18	present	\N	32
405	5	35	2026-02-18	present	\N	32
406	5	36	2026-02-18	present	\N	32
407	5	37	2026-02-18	present	\N	32
408	5	38	2026-02-18	present	\N	32
409	5	33	2026-02-19	present	\N	32
410	5	34	2026-02-19	present	\N	32
411	5	35	2026-02-19	present	\N	32
412	5	36	2026-02-19	present	\N	32
413	5	37	2026-02-19	present	\N	32
414	5	38	2026-02-19	present	\N	32
415	5	33	2026-02-20	present	\N	32
416	5	34	2026-02-20	present	\N	32
417	5	35	2026-02-20	present	\N	32
418	5	36	2026-02-20	present	\N	32
419	5	37	2026-02-20	present	\N	32
420	5	38	2026-02-20	present	\N	32
421	6	40	2026-02-01	present	\N	39
422	6	41	2026-02-01	present	\N	39
423	6	42	2026-02-01	present	\N	39
424	6	43	2026-02-01	present	\N	39
425	6	44	2026-02-01	present	\N	39
426	6	45	2026-02-01	present	\N	39
427	6	40	2026-02-02	present	\N	39
428	6	41	2026-02-02	present	\N	39
429	6	42	2026-02-02	present	\N	39
430	6	43	2026-02-02	present	\N	39
431	6	44	2026-02-02	present	\N	39
432	6	45	2026-02-02	present	\N	39
433	6	40	2026-02-03	present	\N	39
434	6	41	2026-02-03	present	\N	39
435	6	42	2026-02-03	present	\N	39
436	6	43	2026-02-03	present	\N	39
437	6	44	2026-02-03	present	\N	39
438	6	45	2026-02-03	present	\N	39
439	6	40	2026-02-04	present	\N	39
440	6	41	2026-02-04	present	\N	39
441	6	42	2026-02-04	present	\N	39
442	6	43	2026-02-04	present	\N	39
443	6	44	2026-02-04	present	\N	39
444	6	45	2026-02-04	present	\N	39
445	6	40	2026-02-05	present	\N	39
446	6	41	2026-02-05	present	\N	39
447	6	42	2026-02-05	present	\N	39
448	6	43	2026-02-05	present	\N	39
449	6	44	2026-02-05	present	\N	39
450	6	45	2026-02-05	present	\N	39
451	6	40	2026-02-06	present	\N	39
452	6	41	2026-02-06	present	\N	39
453	6	42	2026-02-06	present	\N	39
454	6	43	2026-02-06	present	\N	39
455	6	44	2026-02-06	present	\N	39
456	6	45	2026-02-06	present	\N	39
457	6	40	2026-02-07	present	\N	39
458	6	41	2026-02-07	present	\N	39
459	6	42	2026-02-07	present	\N	39
460	6	43	2026-02-07	present	\N	39
461	6	44	2026-02-07	present	\N	39
462	6	45	2026-02-07	present	\N	39
463	6	40	2026-02-08	present	\N	39
464	6	41	2026-02-08	present	\N	39
465	6	42	2026-02-08	present	\N	39
466	6	43	2026-02-08	present	\N	39
467	6	44	2026-02-08	present	\N	39
468	6	45	2026-02-08	present	\N	39
469	6	40	2026-02-09	present	\N	39
470	6	41	2026-02-09	present	\N	39
471	6	42	2026-02-09	present	\N	39
472	6	43	2026-02-09	present	\N	39
473	6	44	2026-02-09	present	\N	39
474	6	45	2026-02-09	present	\N	39
475	6	40	2026-02-10	present	\N	39
476	6	41	2026-02-10	present	\N	39
477	6	42	2026-02-10	present	\N	39
478	6	43	2026-02-10	present	\N	39
479	6	44	2026-02-10	present	\N	39
480	6	45	2026-02-10	present	\N	39
481	6	40	2026-02-11	present	\N	39
482	6	41	2026-02-11	present	\N	39
483	6	42	2026-02-11	present	\N	39
484	6	43	2026-02-11	present	\N	39
485	6	44	2026-02-11	present	\N	39
486	6	45	2026-02-11	present	\N	39
487	6	40	2026-02-12	present	\N	39
488	6	41	2026-02-12	present	\N	39
489	6	42	2026-02-12	present	\N	39
490	6	43	2026-02-12	present	\N	39
491	6	44	2026-02-12	present	\N	39
492	6	45	2026-02-12	present	\N	39
493	6	40	2026-02-13	present	\N	39
494	6	41	2026-02-13	present	\N	39
495	6	42	2026-02-13	present	\N	39
496	6	43	2026-02-13	present	\N	39
497	6	44	2026-02-13	present	\N	39
498	6	45	2026-02-13	present	\N	39
499	6	40	2026-02-14	present	\N	39
500	6	41	2026-02-14	present	\N	39
501	6	42	2026-02-14	present	\N	39
502	6	43	2026-02-14	present	\N	39
503	6	44	2026-02-14	present	\N	39
504	6	45	2026-02-14	present	\N	39
505	6	40	2026-02-15	present	\N	39
506	6	41	2026-02-15	present	\N	39
507	6	42	2026-02-15	present	\N	39
508	6	43	2026-02-15	present	\N	39
509	6	44	2026-02-15	present	\N	39
510	6	45	2026-02-15	present	\N	39
511	6	40	2026-02-16	present	\N	39
512	6	41	2026-02-16	present	\N	39
513	6	42	2026-02-16	present	\N	39
514	6	43	2026-02-16	present	\N	39
515	6	44	2026-02-16	present	\N	39
516	6	45	2026-02-16	present	\N	39
517	6	40	2026-02-17	present	\N	39
518	6	41	2026-02-17	present	\N	39
519	6	42	2026-02-17	present	\N	39
520	6	43	2026-02-17	present	\N	39
521	6	44	2026-02-17	present	\N	39
522	6	45	2026-02-17	present	\N	39
523	6	40	2026-02-18	present	\N	39
524	6	41	2026-02-18	present	\N	39
525	6	42	2026-02-18	present	\N	39
526	6	43	2026-02-18	present	\N	39
527	6	44	2026-02-18	present	\N	39
528	6	45	2026-02-18	present	\N	39
529	6	40	2026-02-19	present	\N	39
530	6	41	2026-02-19	present	\N	39
531	6	42	2026-02-19	present	\N	39
532	6	43	2026-02-19	present	\N	39
533	6	44	2026-02-19	present	\N	39
534	6	45	2026-02-19	present	\N	39
535	6	40	2026-02-20	present	\N	39
536	6	41	2026-02-20	present	\N	39
537	6	42	2026-02-20	present	\N	39
538	6	43	2026-02-20	present	\N	39
539	6	44	2026-02-20	present	\N	39
540	6	45	2026-02-20	present	\N	39
541	7	47	2026-02-08	present	\N	46
542	7	48	2026-02-08	present	\N	46
543	7	49	2026-02-08	present	\N	46
544	7	50	2026-02-08	present	\N	46
545	7	51	2026-02-08	present	\N	46
546	7	52	2026-02-08	present	\N	46
547	7	47	2026-02-09	present	\N	46
548	7	48	2026-02-09	present	\N	46
549	7	49	2026-02-09	present	\N	46
550	7	50	2026-02-09	present	\N	46
551	7	51	2026-02-09	present	\N	46
552	7	52	2026-02-09	present	\N	46
553	7	47	2026-02-10	present	\N	46
554	7	48	2026-02-10	present	\N	46
555	7	49	2026-02-10	present	\N	46
556	7	50	2026-02-10	present	\N	46
557	7	51	2026-02-10	present	\N	46
558	7	52	2026-02-10	present	\N	46
559	7	47	2026-02-11	present	\N	46
560	7	48	2026-02-11	present	\N	46
561	7	49	2026-02-11	present	\N	46
562	7	50	2026-02-11	present	\N	46
563	7	51	2026-02-11	present	\N	46
564	7	52	2026-02-11	present	\N	46
565	7	47	2026-02-12	present	\N	46
566	7	48	2026-02-12	present	\N	46
567	7	49	2026-02-12	present	\N	46
568	7	50	2026-02-12	present	\N	46
569	7	51	2026-02-12	present	\N	46
570	7	52	2026-02-12	present	\N	46
571	7	47	2026-02-13	present	\N	46
572	7	48	2026-02-13	present	\N	46
573	7	49	2026-02-13	present	\N	46
574	7	50	2026-02-13	present	\N	46
575	7	51	2026-02-13	present	\N	46
576	7	52	2026-02-13	present	\N	46
577	7	47	2026-02-14	present	\N	46
578	7	48	2026-02-14	present	\N	46
579	7	49	2026-02-14	present	\N	46
580	7	50	2026-02-14	present	\N	46
581	7	51	2026-02-14	present	\N	46
582	7	52	2026-02-14	present	\N	46
583	7	47	2026-02-15	present	\N	46
584	7	48	2026-02-15	present	\N	46
585	7	49	2026-02-15	present	\N	46
586	7	50	2026-02-15	present	\N	46
587	7	51	2026-02-15	present	\N	46
588	7	52	2026-02-15	present	\N	46
589	7	47	2026-02-16	present	\N	46
590	7	48	2026-02-16	present	\N	46
591	7	49	2026-02-16	present	\N	46
592	7	50	2026-02-16	present	\N	46
593	7	51	2026-02-16	present	\N	46
594	7	52	2026-02-16	present	\N	46
595	7	47	2026-02-17	present	\N	46
596	7	48	2026-02-17	present	\N	46
597	7	49	2026-02-17	present	\N	46
598	7	50	2026-02-17	present	\N	46
599	7	51	2026-02-17	present	\N	46
600	7	52	2026-02-17	present	\N	46
601	7	47	2026-02-18	present	\N	46
602	7	48	2026-02-18	present	\N	46
603	7	49	2026-02-18	present	\N	46
604	7	50	2026-02-18	present	\N	46
605	7	51	2026-02-18	present	\N	46
606	7	52	2026-02-18	present	\N	46
607	7	47	2026-02-19	present	\N	46
608	7	48	2026-02-19	present	\N	46
609	7	49	2026-02-19	present	\N	46
610	7	50	2026-02-19	present	\N	46
611	7	51	2026-02-19	present	\N	46
612	7	52	2026-02-19	present	\N	46
613	7	47	2026-02-20	present	\N	46
614	7	48	2026-02-20	present	\N	46
615	7	49	2026-02-20	present	\N	46
616	7	50	2026-02-20	present	\N	46
617	7	51	2026-02-20	present	\N	46
618	7	52	2026-02-20	present	\N	46
619	7	47	2026-02-21	present	\N	46
620	7	48	2026-02-21	present	\N	46
621	7	49	2026-02-21	present	\N	46
622	7	50	2026-02-21	present	\N	46
623	7	51	2026-02-21	present	\N	46
624	7	52	2026-02-21	present	\N	46
625	7	47	2026-02-22	present	\N	46
626	7	48	2026-02-22	present	\N	46
627	7	49	2026-02-22	present	\N	46
628	7	50	2026-02-22	present	\N	46
629	7	51	2026-02-22	present	\N	46
630	7	52	2026-02-22	present	\N	46
631	7	47	2026-02-23	present	\N	46
632	7	48	2026-02-23	present	\N	46
633	7	49	2026-02-23	present	\N	46
634	7	50	2026-02-23	present	\N	46
635	7	51	2026-02-23	present	\N	46
636	7	52	2026-02-23	present	\N	46
637	7	47	2026-02-24	present	\N	46
638	7	48	2026-02-24	present	\N	46
639	7	49	2026-02-24	present	\N	46
640	7	50	2026-02-24	present	\N	46
641	7	51	2026-02-24	present	\N	46
642	7	52	2026-02-24	present	\N	46
643	7	47	2026-02-25	present	\N	46
644	7	48	2026-02-25	present	\N	46
645	7	49	2026-02-25	present	\N	46
646	7	50	2026-02-25	present	\N	46
647	7	51	2026-02-25	present	\N	46
648	7	52	2026-02-25	present	\N	46
649	7	47	2026-02-26	present	\N	46
650	7	48	2026-02-26	present	\N	46
651	7	49	2026-02-26	present	\N	46
652	7	50	2026-02-26	present	\N	46
653	7	51	2026-02-26	present	\N	46
654	7	52	2026-02-26	present	\N	46
655	7	47	2026-02-27	present	\N	46
656	7	48	2026-02-27	present	\N	46
657	7	49	2026-02-27	present	\N	46
658	7	50	2026-02-27	present	\N	46
659	7	51	2026-02-27	present	\N	46
660	7	52	2026-02-27	present	\N	46
661	8	54	2026-02-08	present	\N	53
662	8	55	2026-02-08	present	\N	53
663	8	56	2026-02-08	present	\N	53
664	8	57	2026-02-08	present	\N	53
665	8	58	2026-02-08	present	\N	53
666	8	59	2026-02-08	present	\N	53
667	8	54	2026-02-09	present	\N	53
668	8	55	2026-02-09	present	\N	53
669	8	56	2026-02-09	present	\N	53
670	8	57	2026-02-09	present	\N	53
671	8	58	2026-02-09	present	\N	53
672	8	59	2026-02-09	present	\N	53
673	8	54	2026-02-10	present	\N	53
674	8	55	2026-02-10	present	\N	53
675	8	56	2026-02-10	present	\N	53
676	8	57	2026-02-10	present	\N	53
677	8	58	2026-02-10	present	\N	53
678	8	59	2026-02-10	present	\N	53
679	8	54	2026-02-11	present	\N	53
680	8	55	2026-02-11	present	\N	53
681	8	56	2026-02-11	present	\N	53
682	8	57	2026-02-11	present	\N	53
683	8	58	2026-02-11	present	\N	53
684	8	59	2026-02-11	present	\N	53
685	8	54	2026-02-12	present	\N	53
686	8	55	2026-02-12	present	\N	53
687	8	56	2026-02-12	present	\N	53
688	8	57	2026-02-12	present	\N	53
689	8	58	2026-02-12	present	\N	53
690	8	59	2026-02-12	present	\N	53
691	8	54	2026-02-13	present	\N	53
692	8	55	2026-02-13	present	\N	53
693	8	56	2026-02-13	present	\N	53
694	8	57	2026-02-13	present	\N	53
695	8	58	2026-02-13	present	\N	53
696	8	59	2026-02-13	present	\N	53
697	8	54	2026-02-14	present	\N	53
698	8	55	2026-02-14	present	\N	53
699	8	56	2026-02-14	present	\N	53
700	8	57	2026-02-14	present	\N	53
701	8	58	2026-02-14	present	\N	53
702	8	59	2026-02-14	present	\N	53
703	8	54	2026-02-15	present	\N	53
704	8	55	2026-02-15	present	\N	53
705	8	56	2026-02-15	present	\N	53
706	8	57	2026-02-15	present	\N	53
707	8	58	2026-02-15	present	\N	53
708	8	59	2026-02-15	present	\N	53
709	8	54	2026-02-16	present	\N	53
710	8	55	2026-02-16	present	\N	53
711	8	56	2026-02-16	present	\N	53
712	8	57	2026-02-16	present	\N	53
713	8	58	2026-02-16	present	\N	53
714	8	59	2026-02-16	present	\N	53
715	8	54	2026-02-17	present	\N	53
716	8	55	2026-02-17	present	\N	53
717	8	56	2026-02-17	present	\N	53
718	8	57	2026-02-17	present	\N	53
719	8	58	2026-02-17	present	\N	53
720	8	59	2026-02-17	present	\N	53
721	8	54	2026-02-18	present	\N	53
722	8	55	2026-02-18	present	\N	53
723	8	56	2026-02-18	present	\N	53
724	8	57	2026-02-18	present	\N	53
725	8	58	2026-02-18	present	\N	53
726	8	59	2026-02-18	present	\N	53
727	8	54	2026-02-19	present	\N	53
728	8	55	2026-02-19	present	\N	53
729	8	56	2026-02-19	present	\N	53
730	8	57	2026-02-19	present	\N	53
731	8	58	2026-02-19	present	\N	53
732	8	59	2026-02-19	present	\N	53
733	8	54	2026-02-20	present	\N	53
734	8	55	2026-02-20	present	\N	53
735	8	56	2026-02-20	present	\N	53
736	8	57	2026-02-20	present	\N	53
737	8	58	2026-02-20	present	\N	53
738	8	59	2026-02-20	present	\N	53
739	8	54	2026-02-21	present	\N	53
740	8	55	2026-02-21	present	\N	53
741	8	56	2026-02-21	present	\N	53
742	8	57	2026-02-21	present	\N	53
743	8	58	2026-02-21	present	\N	53
744	8	59	2026-02-21	present	\N	53
745	8	54	2026-02-22	present	\N	53
746	8	55	2026-02-22	present	\N	53
747	8	56	2026-02-22	present	\N	53
748	8	57	2026-02-22	present	\N	53
749	8	58	2026-02-22	present	\N	53
750	8	59	2026-02-22	present	\N	53
751	8	54	2026-02-23	present	\N	53
752	8	55	2026-02-23	present	\N	53
753	8	56	2026-02-23	present	\N	53
754	8	57	2026-02-23	present	\N	53
755	8	58	2026-02-23	present	\N	53
756	8	59	2026-02-23	present	\N	53
757	8	54	2026-02-24	present	\N	53
758	8	55	2026-02-24	present	\N	53
759	8	56	2026-02-24	present	\N	53
760	8	57	2026-02-24	present	\N	53
761	8	58	2026-02-24	present	\N	53
762	8	59	2026-02-24	present	\N	53
763	8	54	2026-02-25	present	\N	53
764	8	55	2026-02-25	present	\N	53
765	8	56	2026-02-25	present	\N	53
766	8	57	2026-02-25	present	\N	53
767	8	58	2026-02-25	present	\N	53
768	8	59	2026-02-25	present	\N	53
769	8	54	2026-02-26	present	\N	53
770	8	55	2026-02-26	present	\N	53
771	8	56	2026-02-26	present	\N	53
772	8	57	2026-02-26	present	\N	53
773	8	58	2026-02-26	present	\N	53
774	8	59	2026-02-26	present	\N	53
775	8	54	2026-02-27	present	\N	53
776	8	55	2026-02-27	present	\N	53
777	8	56	2026-02-27	present	\N	53
778	8	57	2026-02-27	present	\N	53
779	8	58	2026-02-27	present	\N	53
780	8	59	2026-02-27	present	\N	53
781	11	61	2026-03-12	present	\N	60
782	11	62	2026-03-12	present	\N	60
783	11	63	2026-03-12	present	\N	60
784	11	64	2026-03-12	present	\N	60
785	11	65	2026-03-12	present	\N	60
786	11	66	2026-03-12	present	\N	60
787	11	61	2026-03-13	present	\N	60
788	11	62	2026-03-13	present	\N	60
789	11	63	2026-03-13	present	\N	60
790	11	64	2026-03-13	present	\N	60
791	11	65	2026-03-13	present	\N	60
792	11	66	2026-03-13	present	\N	60
793	11	61	2026-03-14	present	\N	60
794	11	62	2026-03-14	present	\N	60
795	11	63	2026-03-14	present	\N	60
796	11	64	2026-03-14	present	\N	60
797	11	65	2026-03-14	present	\N	60
798	11	66	2026-03-14	present	\N	60
799	11	61	2026-03-15	present	\N	60
800	11	62	2026-03-15	present	\N	60
801	11	63	2026-03-15	present	\N	60
802	11	64	2026-03-15	present	\N	60
803	11	65	2026-03-15	present	\N	60
804	11	66	2026-03-15	present	\N	60
805	11	61	2026-03-16	present	\N	60
806	11	62	2026-03-16	present	\N	60
807	11	63	2026-03-16	present	\N	60
808	11	64	2026-03-16	present	\N	60
809	11	65	2026-03-16	present	\N	60
810	11	66	2026-03-16	present	\N	60
811	11	61	2026-03-17	present	\N	60
812	11	62	2026-03-17	present	\N	60
813	11	63	2026-03-17	present	\N	60
814	11	64	2026-03-17	present	\N	60
815	11	65	2026-03-17	present	\N	60
816	11	66	2026-03-17	present	\N	60
817	11	61	2026-03-18	present	\N	60
818	11	62	2026-03-18	present	\N	60
819	11	63	2026-03-18	present	\N	60
820	11	64	2026-03-18	present	\N	60
821	11	65	2026-03-18	present	\N	60
822	11	66	2026-03-18	present	\N	60
823	11	61	2026-03-19	present	\N	60
824	11	62	2026-03-19	present	\N	60
825	11	63	2026-03-19	present	\N	60
826	11	64	2026-03-19	present	\N	60
827	11	65	2026-03-19	present	\N	60
828	11	66	2026-03-19	present	\N	60
829	11	61	2026-03-20	present	\N	60
830	11	62	2026-03-20	present	\N	60
831	11	63	2026-03-20	present	\N	60
832	11	64	2026-03-20	present	\N	60
833	11	65	2026-03-20	present	\N	60
834	11	66	2026-03-20	present	\N	60
835	11	61	2026-03-21	present	\N	60
836	11	62	2026-03-21	present	\N	60
837	11	63	2026-03-21	present	\N	60
838	11	64	2026-03-21	present	\N	60
839	11	65	2026-03-21	present	\N	60
840	11	66	2026-03-21	present	\N	60
841	11	61	2026-03-22	present	\N	60
842	11	62	2026-03-22	present	\N	60
843	11	63	2026-03-22	present	\N	60
844	11	64	2026-03-22	present	\N	60
845	11	65	2026-03-22	present	\N	60
846	11	66	2026-03-22	present	\N	60
847	11	61	2026-03-23	present	\N	60
848	11	62	2026-03-23	present	\N	60
849	11	63	2026-03-23	present	\N	60
850	11	64	2026-03-23	present	\N	60
851	11	65	2026-03-23	present	\N	60
852	11	66	2026-03-23	present	\N	60
853	11	61	2026-03-24	present	\N	60
854	11	62	2026-03-24	present	\N	60
855	11	63	2026-03-24	present	\N	60
856	11	64	2026-03-24	present	\N	60
857	11	65	2026-03-24	present	\N	60
858	11	66	2026-03-24	present	\N	60
859	11	61	2026-03-25	present	\N	60
860	11	62	2026-03-25	present	\N	60
861	11	63	2026-03-25	present	\N	60
862	11	64	2026-03-25	present	\N	60
863	11	65	2026-03-25	present	\N	60
864	11	66	2026-03-25	present	\N	60
865	11	61	2026-03-26	present	\N	60
866	11	62	2026-03-26	present	\N	60
867	11	63	2026-03-26	present	\N	60
868	11	64	2026-03-26	present	\N	60
869	11	65	2026-03-26	present	\N	60
870	11	66	2026-03-26	present	\N	60
871	11	61	2026-03-27	present	\N	60
872	11	62	2026-03-27	present	\N	60
873	11	63	2026-03-27	present	\N	60
874	11	64	2026-03-27	present	\N	60
875	11	65	2026-03-27	present	\N	60
876	11	66	2026-03-27	present	\N	60
877	11	61	2026-03-28	present	\N	60
878	11	62	2026-03-28	present	\N	60
879	11	63	2026-03-28	present	\N	60
880	11	64	2026-03-28	present	\N	60
881	11	65	2026-03-28	present	\N	60
882	11	66	2026-03-28	present	\N	60
883	11	61	2026-03-29	present	\N	60
884	11	62	2026-03-29	present	\N	60
885	11	63	2026-03-29	present	\N	60
886	11	64	2026-03-29	present	\N	60
887	11	65	2026-03-29	present	\N	60
888	11	66	2026-03-29	present	\N	60
889	11	61	2026-03-30	present	\N	60
890	11	62	2026-03-30	present	\N	60
891	11	63	2026-03-30	present	\N	60
892	11	64	2026-03-30	present	\N	60
893	11	65	2026-03-30	present	\N	60
894	11	66	2026-03-30	present	\N	60
895	11	61	2026-03-31	present	\N	60
896	11	62	2026-03-31	present	\N	60
897	11	63	2026-03-31	present	\N	60
898	11	64	2026-03-31	present	\N	60
899	11	65	2026-03-31	present	\N	60
900	11	66	2026-03-31	present	\N	60
901	12	68	2026-03-12	present	\N	67
902	12	69	2026-03-12	present	\N	67
903	12	70	2026-03-12	present	\N	67
904	12	71	2026-03-12	present	\N	67
905	12	72	2026-03-12	present	\N	67
906	12	73	2026-03-12	present	\N	67
907	12	68	2026-03-13	present	\N	67
908	12	69	2026-03-13	present	\N	67
909	12	70	2026-03-13	present	\N	67
910	12	71	2026-03-13	present	\N	67
911	12	72	2026-03-13	present	\N	67
912	12	73	2026-03-13	present	\N	67
913	12	68	2026-03-14	present	\N	67
914	12	69	2026-03-14	present	\N	67
915	12	70	2026-03-14	present	\N	67
916	12	71	2026-03-14	present	\N	67
917	12	72	2026-03-14	present	\N	67
918	12	73	2026-03-14	present	\N	67
919	12	68	2026-03-15	present	\N	67
920	12	69	2026-03-15	present	\N	67
921	12	70	2026-03-15	present	\N	67
922	12	71	2026-03-15	present	\N	67
923	12	72	2026-03-15	present	\N	67
924	12	73	2026-03-15	present	\N	67
925	12	68	2026-03-16	present	\N	67
926	12	69	2026-03-16	present	\N	67
927	12	70	2026-03-16	present	\N	67
928	12	71	2026-03-16	present	\N	67
929	12	72	2026-03-16	present	\N	67
930	12	73	2026-03-16	present	\N	67
931	12	68	2026-03-17	present	\N	67
932	12	69	2026-03-17	present	\N	67
933	12	70	2026-03-17	present	\N	67
934	12	71	2026-03-17	present	\N	67
935	12	72	2026-03-17	present	\N	67
936	12	73	2026-03-17	present	\N	67
937	12	68	2026-03-18	present	\N	67
938	12	69	2026-03-18	present	\N	67
939	12	70	2026-03-18	present	\N	67
940	12	71	2026-03-18	present	\N	67
941	12	72	2026-03-18	present	\N	67
942	12	73	2026-03-18	present	\N	67
943	12	68	2026-03-19	present	\N	67
944	12	69	2026-03-19	present	\N	67
945	12	70	2026-03-19	present	\N	67
946	12	71	2026-03-19	present	\N	67
947	12	72	2026-03-19	present	\N	67
948	12	73	2026-03-19	present	\N	67
949	12	68	2026-03-20	present	\N	67
950	12	69	2026-03-20	present	\N	67
951	12	70	2026-03-20	present	\N	67
952	12	71	2026-03-20	present	\N	67
953	12	72	2026-03-20	present	\N	67
954	12	73	2026-03-20	present	\N	67
955	12	68	2026-03-21	present	\N	67
956	12	69	2026-03-21	present	\N	67
957	12	70	2026-03-21	present	\N	67
958	12	71	2026-03-21	present	\N	67
959	12	72	2026-03-21	present	\N	67
960	12	73	2026-03-21	present	\N	67
961	12	68	2026-03-22	present	\N	67
962	12	69	2026-03-22	present	\N	67
963	12	70	2026-03-22	present	\N	67
964	12	71	2026-03-22	present	\N	67
965	12	72	2026-03-22	present	\N	67
966	12	73	2026-03-22	present	\N	67
967	12	68	2026-03-23	present	\N	67
968	12	69	2026-03-23	present	\N	67
969	12	70	2026-03-23	present	\N	67
970	12	71	2026-03-23	present	\N	67
971	12	72	2026-03-23	present	\N	67
972	12	73	2026-03-23	present	\N	67
973	12	68	2026-03-24	present	\N	67
974	12	69	2026-03-24	present	\N	67
975	12	70	2026-03-24	present	\N	67
976	12	71	2026-03-24	present	\N	67
977	12	72	2026-03-24	present	\N	67
978	12	73	2026-03-24	present	\N	67
979	12	68	2026-03-25	present	\N	67
980	12	69	2026-03-25	present	\N	67
981	12	70	2026-03-25	present	\N	67
982	12	71	2026-03-25	present	\N	67
983	12	72	2026-03-25	present	\N	67
984	12	73	2026-03-25	present	\N	67
985	12	68	2026-03-26	present	\N	67
986	12	69	2026-03-26	present	\N	67
987	12	70	2026-03-26	present	\N	67
988	12	71	2026-03-26	present	\N	67
989	12	72	2026-03-26	present	\N	67
990	12	73	2026-03-26	present	\N	67
991	12	68	2026-03-27	present	\N	67
992	12	69	2026-03-27	present	\N	67
993	12	70	2026-03-27	present	\N	67
994	12	71	2026-03-27	present	\N	67
995	12	72	2026-03-27	present	\N	67
996	12	73	2026-03-27	present	\N	67
997	12	68	2026-03-28	present	\N	67
998	12	69	2026-03-28	present	\N	67
999	12	70	2026-03-28	present	\N	67
1000	12	71	2026-03-28	present	\N	67
1001	12	72	2026-03-28	present	\N	67
1002	12	73	2026-03-28	present	\N	67
1003	12	68	2026-03-29	present	\N	67
1004	12	69	2026-03-29	present	\N	67
1005	12	70	2026-03-29	present	\N	67
1006	12	71	2026-03-29	present	\N	67
1007	12	72	2026-03-29	present	\N	67
1008	12	73	2026-03-29	present	\N	67
1009	12	68	2026-03-30	present	\N	67
1010	12	69	2026-03-30	present	\N	67
1011	12	70	2026-03-30	present	\N	67
1012	12	71	2026-03-30	present	\N	67
1013	12	72	2026-03-30	present	\N	67
1014	12	73	2026-03-30	present	\N	67
1015	12	68	2026-03-31	present	\N	67
1016	12	69	2026-03-31	present	\N	67
1017	12	70	2026-03-31	present	\N	67
1018	12	71	2026-03-31	present	\N	67
1019	12	72	2026-03-31	present	\N	67
1020	12	73	2026-03-31	present	\N	67
1021	21	75	2026-03-25	present	\N	74
1022	21	76	2026-03-25	present	\N	74
1023	21	77	2026-03-25	present	\N	74
1024	21	78	2026-03-25	present	\N	74
1025	21	79	2026-03-25	present	\N	74
1026	21	80	2026-03-25	present	\N	74
1027	21	75	2026-03-26	present	\N	74
1028	21	76	2026-03-26	present	\N	74
1029	21	77	2026-03-26	present	\N	74
1030	21	78	2026-03-26	present	\N	74
1031	21	79	2026-03-26	present	\N	74
1032	21	80	2026-03-26	present	\N	74
1033	21	75	2026-03-27	present	\N	74
1034	21	76	2026-03-27	present	\N	74
1035	21	77	2026-03-27	present	\N	74
1036	21	78	2026-03-27	present	\N	74
1037	21	79	2026-03-27	present	\N	74
1038	21	80	2026-03-27	present	\N	74
1039	21	75	2026-03-28	present	\N	74
1040	21	76	2026-03-28	present	\N	74
1041	21	77	2026-03-28	present	\N	74
1042	21	78	2026-03-28	present	\N	74
1043	21	79	2026-03-28	present	\N	74
1044	21	80	2026-03-28	present	\N	74
1045	21	75	2026-03-29	present	\N	74
1046	21	76	2026-03-29	present	\N	74
1047	21	77	2026-03-29	present	\N	74
1048	21	78	2026-03-29	present	\N	74
1049	21	79	2026-03-29	present	\N	74
1050	21	80	2026-03-29	present	\N	74
1051	21	75	2026-03-30	present	\N	74
1052	21	76	2026-03-30	present	\N	74
1053	21	77	2026-03-30	present	\N	74
1054	21	78	2026-03-30	present	\N	74
1055	21	79	2026-03-30	present	\N	74
1056	21	80	2026-03-30	present	\N	74
1057	21	75	2026-03-31	present	\N	74
1058	21	76	2026-03-31	present	\N	74
1059	21	77	2026-03-31	present	\N	74
1060	21	78	2026-03-31	present	\N	74
1061	21	79	2026-03-31	present	\N	74
1062	21	80	2026-03-31	present	\N	74
1063	21	75	2026-04-01	present	\N	74
1064	21	76	2026-04-01	present	\N	74
1065	21	77	2026-04-01	present	\N	74
1066	21	78	2026-04-01	present	\N	74
1067	21	79	2026-04-01	present	\N	74
1068	21	80	2026-04-01	present	\N	74
1069	21	75	2026-04-02	present	\N	74
1070	21	76	2026-04-02	present	\N	74
1071	21	77	2026-04-02	present	\N	74
1072	21	78	2026-04-02	present	\N	74
1073	21	79	2026-04-02	present	\N	74
1074	21	80	2026-04-02	present	\N	74
1075	21	75	2026-04-03	present	\N	74
1076	21	76	2026-04-03	present	\N	74
1077	21	77	2026-04-03	present	\N	74
1078	21	78	2026-04-03	present	\N	74
1079	21	79	2026-04-03	present	\N	74
1080	21	80	2026-04-03	present	\N	74
1081	21	75	2026-04-04	present	\N	74
1082	21	76	2026-04-04	present	\N	74
1083	21	77	2026-04-04	present	\N	74
1084	21	78	2026-04-04	present	\N	74
1085	21	79	2026-04-04	present	\N	74
1086	21	80	2026-04-04	present	\N	74
1087	21	75	2026-04-05	present	\N	74
1088	21	76	2026-04-05	present	\N	74
1089	21	77	2026-04-05	present	\N	74
1090	21	78	2026-04-05	present	\N	74
1091	21	79	2026-04-05	present	\N	74
1092	21	80	2026-04-05	present	\N	74
1093	21	75	2026-04-06	present	\N	74
1094	21	76	2026-04-06	present	\N	74
1095	21	77	2026-04-06	present	\N	74
1096	21	78	2026-04-06	present	\N	74
1097	21	79	2026-04-06	present	\N	74
1098	21	80	2026-04-06	present	\N	74
1099	21	75	2026-04-07	present	\N	74
1100	21	76	2026-04-07	present	\N	74
1101	21	77	2026-04-07	present	\N	74
1102	21	78	2026-04-07	present	\N	74
1103	21	79	2026-04-07	present	\N	74
1104	21	80	2026-04-07	present	\N	74
1105	21	75	2026-04-08	present	\N	74
1106	21	76	2026-04-08	present	\N	74
1107	21	77	2026-04-08	present	\N	74
1108	21	78	2026-04-08	present	\N	74
1109	21	79	2026-04-08	present	\N	74
1110	21	80	2026-04-08	present	\N	74
1111	21	75	2026-04-09	present	\N	74
1112	21	76	2026-04-09	present	\N	74
1113	21	77	2026-04-09	present	\N	74
1114	21	78	2026-04-09	present	\N	74
1115	21	79	2026-04-09	present	\N	74
1116	21	80	2026-04-09	present	\N	74
1117	21	75	2026-04-10	present	\N	74
1118	21	76	2026-04-10	present	\N	74
1119	21	77	2026-04-10	present	\N	74
1120	21	78	2026-04-10	present	\N	74
1121	21	79	2026-04-10	present	\N	74
1122	21	80	2026-04-10	present	\N	74
1123	21	75	2026-04-11	present	\N	74
1124	21	76	2026-04-11	present	\N	74
1125	21	77	2026-04-11	present	\N	74
1126	21	78	2026-04-11	present	\N	74
1127	21	79	2026-04-11	present	\N	74
1128	21	80	2026-04-11	present	\N	74
1129	21	75	2026-04-12	present	\N	74
1130	21	76	2026-04-12	present	\N	74
1131	21	77	2026-04-12	present	\N	74
1132	21	78	2026-04-12	present	\N	74
1133	21	79	2026-04-12	present	\N	74
1134	21	80	2026-04-12	present	\N	74
1135	21	75	2026-04-13	present	\N	74
1136	21	76	2026-04-13	present	\N	74
1137	21	77	2026-04-13	present	\N	74
1138	21	78	2026-04-13	present	\N	74
1139	21	79	2026-04-13	present	\N	74
1140	21	80	2026-04-13	present	\N	74
1141	22	82	2026-03-29	present	\N	81
1142	22	83	2026-03-29	present	\N	81
1143	22	84	2026-03-29	present	\N	81
1144	22	85	2026-03-29	present	\N	81
1145	22	86	2026-03-29	present	\N	81
1146	22	87	2026-03-29	present	\N	81
1147	22	82	2026-03-30	present	\N	81
1148	22	83	2026-03-30	present	\N	81
1149	22	84	2026-03-30	present	\N	81
1150	22	85	2026-03-30	present	\N	81
1151	22	86	2026-03-30	present	\N	81
1152	22	87	2026-03-30	present	\N	81
1153	22	82	2026-03-31	present	\N	81
1154	22	83	2026-03-31	present	\N	81
1155	22	84	2026-03-31	present	\N	81
1156	22	85	2026-03-31	present	\N	81
1157	22	86	2026-03-31	present	\N	81
1158	22	87	2026-03-31	present	\N	81
1159	22	82	2026-04-01	present	\N	81
1160	22	83	2026-04-01	present	\N	81
1161	22	84	2026-04-01	present	\N	81
1162	22	85	2026-04-01	present	\N	81
1163	22	86	2026-04-01	present	\N	81
1164	22	87	2026-04-01	present	\N	81
1165	22	82	2026-04-02	present	\N	81
1166	22	83	2026-04-02	present	\N	81
1167	22	84	2026-04-02	present	\N	81
1168	22	85	2026-04-02	present	\N	81
1169	22	86	2026-04-02	present	\N	81
1170	22	87	2026-04-02	present	\N	81
1177	22	82	2026-04-04	present	\N	81
1178	22	83	2026-04-04	present	\N	81
1179	22	84	2026-04-04	present	\N	81
1180	22	85	2026-04-04	present	\N	81
1181	22	86	2026-04-04	present	\N	81
1182	22	87	2026-04-04	present	\N	81
1183	22	82	2026-04-05	present	\N	81
1184	22	83	2026-04-05	present	\N	81
1185	22	84	2026-04-05	present	\N	81
1186	22	85	2026-04-05	present	\N	81
1187	22	86	2026-04-05	present	\N	81
1188	22	87	2026-04-05	present	\N	81
1189	22	82	2026-04-06	present	\N	81
1190	22	83	2026-04-06	present	\N	81
1191	22	84	2026-04-06	present	\N	81
1192	22	85	2026-04-06	present	\N	81
1193	22	86	2026-04-06	present	\N	81
1194	22	87	2026-04-06	present	\N	81
1195	22	82	2026-04-07	present	\N	81
1196	22	83	2026-04-07	present	\N	81
1197	22	84	2026-04-07	present	\N	81
1198	22	85	2026-04-07	present	\N	81
1199	22	86	2026-04-07	present	\N	81
1200	22	87	2026-04-07	present	\N	81
1201	22	82	2026-04-08	present	\N	81
1202	22	83	2026-04-08	present	\N	81
1203	22	84	2026-04-08	present	\N	81
1204	22	85	2026-04-08	present	\N	81
1205	22	86	2026-04-08	present	\N	81
1206	22	87	2026-04-08	present	\N	81
1207	22	82	2026-04-09	present	\N	81
1208	22	83	2026-04-09	present	\N	81
1209	22	84	2026-04-09	present	\N	81
1210	22	85	2026-04-09	present	\N	81
1211	22	86	2026-04-09	present	\N	81
1212	22	87	2026-04-09	present	\N	81
1213	22	82	2026-04-10	present	\N	81
1214	22	83	2026-04-10	present	\N	81
1215	22	84	2026-04-10	present	\N	81
1216	22	85	2026-04-10	present	\N	81
1217	22	86	2026-04-10	present	\N	81
1218	22	87	2026-04-10	present	\N	81
1219	22	82	2026-04-11	present	\N	81
1220	22	83	2026-04-11	present	\N	81
1221	22	84	2026-04-11	present	\N	81
1222	22	85	2026-04-11	present	\N	81
1223	22	86	2026-04-11	present	\N	81
1224	22	87	2026-04-11	present	\N	81
1225	22	82	2026-04-12	present	\N	81
1226	22	83	2026-04-12	present	\N	81
1227	22	84	2026-04-12	present	\N	81
1228	22	85	2026-04-12	present	\N	81
1229	22	86	2026-04-12	present	\N	81
1230	22	87	2026-04-12	present	\N	81
1231	22	82	2026-04-13	present	\N	81
1232	22	83	2026-04-13	present	\N	81
1233	22	84	2026-04-13	present	\N	81
1234	22	85	2026-04-13	present	\N	81
1235	22	86	2026-04-13	present	\N	81
1236	22	87	2026-04-13	present	\N	81
1237	22	82	2026-04-14	present	\N	81
1238	22	83	2026-04-14	present	\N	81
1239	22	84	2026-04-14	present	\N	81
1240	22	85	2026-04-14	present	\N	81
1241	22	86	2026-04-14	present	\N	81
1242	22	87	2026-04-14	present	\N	81
1243	22	82	2026-04-15	present	\N	81
1244	22	83	2026-04-15	present	\N	81
1245	22	84	2026-04-15	present	\N	81
1246	22	85	2026-04-15	present	\N	81
1247	22	86	2026-04-15	present	\N	81
1248	22	87	2026-04-15	present	\N	81
1249	22	82	2026-04-16	present	\N	81
1250	22	83	2026-04-16	present	\N	81
1251	22	84	2026-04-16	present	\N	81
1252	22	85	2026-04-16	present	\N	81
1253	22	86	2026-04-16	present	\N	81
1254	22	87	2026-04-16	present	\N	81
1255	22	82	2026-04-17	present	\N	81
1256	22	83	2026-04-17	present	\N	81
1257	22	84	2026-04-17	present	\N	81
1258	22	85	2026-04-17	present	\N	81
1259	22	86	2026-04-17	present	\N	81
1260	22	87	2026-04-17	present	\N	81
1261	22	82	2026-04-03	present	\N	81
1262	22	83	2026-04-03	present	\N	81
1263	22	84	2026-04-03	present	\N	81
1264	22	85	2026-04-03	present	\N	81
1265	22	86	2026-04-03	present	\N	81
1266	22	87	2026-04-03	present	\N	81
1267	22	82	2026-04-28	present	\N	81
1268	23	89	2026-03-31	present	\N	88
1269	23	90	2026-03-31	present	\N	88
1270	23	91	2026-03-31	present	\N	88
1271	23	92	2026-03-31	present	\N	88
1272	23	93	2026-03-31	present	\N	88
1273	23	94	2026-03-31	present	\N	88
1274	23	89	2026-04-01	present	\N	88
1275	23	90	2026-04-01	present	\N	88
1276	23	91	2026-04-01	present	\N	88
1277	23	92	2026-04-01	present	\N	88
1278	23	93	2026-04-01	present	\N	88
1279	23	94	2026-04-01	present	\N	88
1280	23	89	2026-04-02	present	\N	88
1281	23	90	2026-04-02	present	\N	88
1282	23	91	2026-04-02	present	\N	88
1283	23	92	2026-04-02	present	\N	88
1284	23	93	2026-04-02	present	\N	88
1285	23	94	2026-04-02	present	\N	88
1286	23	89	2026-04-03	present	\N	88
1287	23	90	2026-04-03	present	\N	88
1288	23	91	2026-04-03	present	\N	88
1289	23	92	2026-04-03	present	\N	88
1290	23	93	2026-04-03	present	\N	88
1291	23	94	2026-04-03	present	\N	88
1292	23	89	2026-04-04	present	\N	88
1293	23	90	2026-04-04	present	\N	88
1294	23	91	2026-04-04	present	\N	88
1295	23	92	2026-04-04	present	\N	88
1296	23	93	2026-04-04	present	\N	88
1297	23	94	2026-04-04	present	\N	88
1298	23	89	2026-04-05	present	\N	88
1299	23	90	2026-04-05	present	\N	88
1300	23	91	2026-04-05	present	\N	88
1301	23	92	2026-04-05	present	\N	88
1302	23	93	2026-04-05	present	\N	88
1303	23	94	2026-04-05	present	\N	88
1304	23	89	2026-04-06	present	\N	88
1305	23	90	2026-04-06	present	\N	88
1306	23	91	2026-04-06	present	\N	88
1307	23	92	2026-04-06	present	\N	88
1308	23	93	2026-04-06	present	\N	88
1309	23	94	2026-04-06	present	\N	88
1310	23	89	2026-04-07	present	\N	88
1311	23	90	2026-04-07	present	\N	88
1312	23	91	2026-04-07	present	\N	88
1313	23	92	2026-04-07	present	\N	88
1314	23	93	2026-04-07	present	\N	88
1315	23	94	2026-04-07	present	\N	88
1316	23	89	2026-04-08	present	\N	88
1317	23	90	2026-04-08	present	\N	88
1318	23	91	2026-04-08	present	\N	88
1319	23	92	2026-04-08	present	\N	88
1320	23	93	2026-04-08	present	\N	88
1321	23	94	2026-04-08	present	\N	88
1322	23	89	2026-04-09	present	\N	88
1323	23	90	2026-04-09	present	\N	88
1324	23	91	2026-04-09	present	\N	88
1325	23	92	2026-04-09	present	\N	88
1326	23	93	2026-04-09	present	\N	88
1327	23	94	2026-04-09	present	\N	88
1328	23	89	2026-04-10	present	\N	88
1329	23	90	2026-04-10	present	\N	88
1330	23	91	2026-04-10	present	\N	88
1331	23	92	2026-04-10	present	\N	88
1332	23	93	2026-04-10	present	\N	88
1333	23	94	2026-04-10	present	\N	88
1334	23	89	2026-04-11	present	\N	88
1335	23	90	2026-04-11	present	\N	88
1336	23	91	2026-04-11	present	\N	88
1337	23	92	2026-04-11	present	\N	88
1338	23	93	2026-04-11	present	\N	88
1339	23	94	2026-04-11	present	\N	88
1340	23	89	2026-04-12	present	\N	88
1341	23	90	2026-04-12	present	\N	88
1342	23	91	2026-04-12	present	\N	88
1343	23	92	2026-04-12	present	\N	88
1344	23	93	2026-04-12	present	\N	88
1345	23	94	2026-04-12	present	\N	88
1346	23	89	2026-04-13	present	\N	88
1347	23	90	2026-04-13	present	\N	88
1348	23	91	2026-04-13	present	\N	88
1349	23	92	2026-04-13	present	\N	88
1350	23	93	2026-04-13	present	\N	88
1351	23	94	2026-04-13	present	\N	88
1352	23	89	2026-04-14	present	\N	88
1353	23	90	2026-04-14	present	\N	88
1354	23	91	2026-04-14	present	\N	88
1355	23	92	2026-04-14	present	\N	88
1356	23	93	2026-04-14	present	\N	88
1357	23	94	2026-04-14	present	\N	88
1358	23	89	2026-04-15	present	\N	88
1359	23	90	2026-04-15	present	\N	88
1360	23	91	2026-04-15	present	\N	88
1361	23	92	2026-04-15	present	\N	88
1362	23	93	2026-04-15	present	\N	88
1363	23	94	2026-04-15	present	\N	88
1364	23	89	2026-04-16	present	\N	88
1365	23	90	2026-04-16	present	\N	88
1366	23	91	2026-04-16	present	\N	88
1367	23	92	2026-04-16	present	\N	88
1368	23	93	2026-04-16	present	\N	88
1369	23	94	2026-04-16	present	\N	88
1370	23	89	2026-04-17	present	\N	88
1371	23	90	2026-04-17	present	\N	88
1372	23	91	2026-04-17	present	\N	88
1373	23	92	2026-04-17	present	\N	88
1374	23	93	2026-04-17	present	\N	88
1375	23	94	2026-04-17	present	\N	88
1376	23	89	2026-04-18	present	\N	88
1377	23	90	2026-04-18	present	\N	88
1378	23	91	2026-04-18	present	\N	88
1379	23	92	2026-04-18	present	\N	88
1380	23	93	2026-04-18	present	\N	88
1381	23	94	2026-04-18	present	\N	88
1382	23	89	2026-04-19	present	\N	88
1383	23	90	2026-04-19	present	\N	88
1384	23	91	2026-04-19	present	\N	88
1385	23	92	2026-04-19	present	\N	88
1386	23	93	2026-04-19	present	\N	88
1387	23	94	2026-04-19	present	\N	88
1388	24	96	2026-03-31	present	\N	95
1389	24	97	2026-03-31	present	\N	95
1390	24	98	2026-03-31	present	\N	95
1391	24	99	2026-03-31	present	\N	95
1392	24	100	2026-03-31	present	\N	95
1393	24	101	2026-03-31	present	\N	95
1394	24	96	2026-04-01	present	\N	95
1395	24	97	2026-04-01	present	\N	95
1396	24	98	2026-04-01	present	\N	95
1397	24	99	2026-04-01	present	\N	95
1398	24	100	2026-04-01	present	\N	95
1399	24	101	2026-04-01	present	\N	95
1400	24	96	2026-04-02	present	\N	95
1401	24	97	2026-04-02	present	\N	95
1402	24	98	2026-04-02	present	\N	95
1403	24	99	2026-04-02	present	\N	95
1404	24	100	2026-04-02	present	\N	95
1405	24	101	2026-04-02	present	\N	95
1406	24	96	2026-04-03	present	\N	95
1407	24	97	2026-04-03	present	\N	95
1408	24	98	2026-04-03	present	\N	95
1409	24	99	2026-04-03	present	\N	95
1410	24	100	2026-04-03	present	\N	95
1411	24	101	2026-04-03	present	\N	95
1412	24	96	2026-04-04	present	\N	95
1413	24	97	2026-04-04	present	\N	95
1414	24	98	2026-04-04	present	\N	95
1415	24	99	2026-04-04	present	\N	95
1416	24	100	2026-04-04	present	\N	95
1417	24	101	2026-04-04	present	\N	95
1418	24	96	2026-04-05	present	\N	95
1419	24	97	2026-04-05	present	\N	95
1420	24	98	2026-04-05	present	\N	95
1421	24	99	2026-04-05	present	\N	95
1422	24	100	2026-04-05	present	\N	95
1423	24	101	2026-04-05	present	\N	95
1424	24	96	2026-04-06	present	\N	95
1425	24	97	2026-04-06	present	\N	95
1426	24	98	2026-04-06	present	\N	95
1427	24	99	2026-04-06	present	\N	95
1428	24	100	2026-04-06	present	\N	95
1429	24	101	2026-04-06	present	\N	95
1430	24	96	2026-04-07	present	\N	95
1431	24	97	2026-04-07	present	\N	95
1432	24	98	2026-04-07	present	\N	95
1433	24	99	2026-04-07	present	\N	95
1434	24	100	2026-04-07	present	\N	95
1435	24	101	2026-04-07	present	\N	95
1436	24	96	2026-04-08	present	\N	95
1437	24	97	2026-04-08	present	\N	95
1438	24	98	2026-04-08	present	\N	95
1439	24	99	2026-04-08	present	\N	95
1440	24	100	2026-04-08	present	\N	95
1441	24	101	2026-04-08	present	\N	95
1442	24	96	2026-04-09	present	\N	95
1443	24	97	2026-04-09	present	\N	95
1444	24	98	2026-04-09	present	\N	95
1445	24	99	2026-04-09	present	\N	95
1446	24	100	2026-04-09	present	\N	95
1447	24	101	2026-04-09	present	\N	95
1448	24	96	2026-04-10	present	\N	95
1449	24	97	2026-04-10	present	\N	95
1450	24	98	2026-04-10	present	\N	95
1451	24	99	2026-04-10	present	\N	95
1452	24	100	2026-04-10	present	\N	95
1453	24	101	2026-04-10	present	\N	95
1454	24	96	2026-04-11	present	\N	95
1455	24	97	2026-04-11	present	\N	95
1456	24	98	2026-04-11	present	\N	95
1457	24	99	2026-04-11	present	\N	95
1458	24	100	2026-04-11	present	\N	95
1459	24	101	2026-04-11	present	\N	95
1460	24	96	2026-04-12	present	\N	95
1461	24	97	2026-04-12	present	\N	95
1462	24	98	2026-04-12	present	\N	95
1463	24	99	2026-04-12	present	\N	95
1464	24	100	2026-04-12	present	\N	95
1465	24	101	2026-04-12	present	\N	95
1466	24	96	2026-04-13	present	\N	95
1467	24	97	2026-04-13	present	\N	95
1468	24	98	2026-04-13	present	\N	95
1469	24	99	2026-04-13	present	\N	95
1470	24	100	2026-04-13	present	\N	95
1471	24	101	2026-04-13	present	\N	95
1472	24	96	2026-04-14	present	\N	95
1473	24	97	2026-04-14	present	\N	95
1474	24	98	2026-04-14	present	\N	95
1475	24	99	2026-04-14	present	\N	95
1476	24	100	2026-04-14	present	\N	95
1477	24	101	2026-04-14	present	\N	95
1478	24	96	2026-04-15	present	\N	95
1479	24	97	2026-04-15	present	\N	95
1480	24	98	2026-04-15	present	\N	95
1481	24	99	2026-04-15	present	\N	95
1482	24	100	2026-04-15	present	\N	95
1483	24	101	2026-04-15	present	\N	95
1484	24	96	2026-04-16	present	\N	95
1485	24	97	2026-04-16	present	\N	95
1486	24	98	2026-04-16	present	\N	95
1487	24	99	2026-04-16	present	\N	95
1488	24	100	2026-04-16	present	\N	95
1489	24	101	2026-04-16	present	\N	95
1490	24	96	2026-04-17	present	\N	95
1491	24	97	2026-04-17	present	\N	95
1492	24	98	2026-04-17	present	\N	95
1493	24	99	2026-04-17	present	\N	95
1494	24	100	2026-04-17	present	\N	95
1495	24	101	2026-04-17	present	\N	95
1496	24	96	2026-04-18	present	\N	95
1497	24	97	2026-04-18	present	\N	95
1498	24	98	2026-04-18	present	\N	95
1499	24	99	2026-04-18	present	\N	95
1500	24	100	2026-04-18	present	\N	95
1501	24	101	2026-04-18	present	\N	95
1502	24	96	2026-04-19	present	\N	95
1503	24	97	2026-04-19	present	\N	95
1504	24	98	2026-04-19	present	\N	95
1505	24	99	2026-04-19	present	\N	95
1506	24	100	2026-04-19	present	\N	95
1507	24	101	2026-04-19	present	\N	95
1508	25	103	2026-03-31	present	\N	102
1509	25	104	2026-03-31	present	\N	102
1510	25	105	2026-03-31	present	\N	102
1511	25	106	2026-03-31	present	\N	102
1512	25	107	2026-03-31	present	\N	102
1513	25	108	2026-03-31	present	\N	102
1514	25	103	2026-04-01	present	\N	102
1515	25	104	2026-04-01	present	\N	102
1516	25	105	2026-04-01	present	\N	102
1517	25	106	2026-04-01	present	\N	102
1518	25	107	2026-04-01	present	\N	102
1519	25	108	2026-04-01	present	\N	102
1520	25	103	2026-04-02	present	\N	102
1521	25	104	2026-04-02	present	\N	102
1522	25	105	2026-04-02	present	\N	102
1523	25	106	2026-04-02	present	\N	102
1524	25	107	2026-04-02	present	\N	102
1525	25	108	2026-04-02	present	\N	102
1526	25	103	2026-04-03	present	\N	102
1527	25	104	2026-04-03	present	\N	102
1528	25	105	2026-04-03	present	\N	102
1529	25	106	2026-04-03	present	\N	102
1530	25	107	2026-04-03	present	\N	102
1531	25	108	2026-04-03	present	\N	102
1532	25	103	2026-04-04	present	\N	102
1533	25	104	2026-04-04	present	\N	102
1534	25	105	2026-04-04	present	\N	102
1535	25	106	2026-04-04	present	\N	102
1536	25	107	2026-04-04	present	\N	102
1537	25	108	2026-04-04	present	\N	102
1538	25	103	2026-04-05	present	\N	102
1539	25	104	2026-04-05	present	\N	102
1540	25	105	2026-04-05	present	\N	102
1541	25	106	2026-04-05	present	\N	102
1542	25	107	2026-04-05	present	\N	102
1543	25	108	2026-04-05	present	\N	102
1544	25	103	2026-04-06	present	\N	102
1545	25	104	2026-04-06	present	\N	102
1546	25	105	2026-04-06	present	\N	102
1547	25	106	2026-04-06	present	\N	102
1548	25	107	2026-04-06	present	\N	102
1549	25	108	2026-04-06	present	\N	102
1550	25	103	2026-04-07	present	\N	102
1551	25	104	2026-04-07	present	\N	102
1552	25	105	2026-04-07	present	\N	102
1553	25	106	2026-04-07	present	\N	102
1554	25	107	2026-04-07	present	\N	102
1555	25	108	2026-04-07	present	\N	102
1556	25	103	2026-04-08	present	\N	102
1557	25	104	2026-04-08	present	\N	102
1558	25	105	2026-04-08	present	\N	102
1559	25	106	2026-04-08	present	\N	102
1560	25	107	2026-04-08	present	\N	102
1561	25	108	2026-04-08	present	\N	102
1562	25	103	2026-04-09	present	\N	102
1563	25	104	2026-04-09	present	\N	102
1564	25	105	2026-04-09	present	\N	102
1565	25	106	2026-04-09	present	\N	102
1566	25	107	2026-04-09	present	\N	102
1567	25	108	2026-04-09	present	\N	102
1568	25	103	2026-04-10	present	\N	102
1569	25	104	2026-04-10	present	\N	102
1570	25	105	2026-04-10	present	\N	102
1571	25	106	2026-04-10	present	\N	102
1572	25	107	2026-04-10	present	\N	102
1573	25	108	2026-04-10	present	\N	102
1574	25	103	2026-04-11	present	\N	102
1575	25	104	2026-04-11	present	\N	102
1576	25	105	2026-04-11	present	\N	102
1577	25	106	2026-04-11	present	\N	102
1578	25	107	2026-04-11	present	\N	102
1579	25	108	2026-04-11	present	\N	102
1580	25	103	2026-04-12	present	\N	102
1581	25	104	2026-04-12	present	\N	102
1582	25	105	2026-04-12	present	\N	102
1583	25	106	2026-04-12	present	\N	102
1584	25	107	2026-04-12	present	\N	102
1585	25	108	2026-04-12	present	\N	102
1586	25	103	2026-04-13	present	\N	102
1587	25	104	2026-04-13	present	\N	102
1588	25	105	2026-04-13	present	\N	102
1589	25	106	2026-04-13	present	\N	102
1590	25	107	2026-04-13	present	\N	102
1591	25	108	2026-04-13	present	\N	102
1592	25	103	2026-04-14	present	\N	102
1593	25	104	2026-04-14	present	\N	102
1594	25	105	2026-04-14	present	\N	102
1595	25	106	2026-04-14	present	\N	102
1596	25	107	2026-04-14	present	\N	102
1597	25	108	2026-04-14	present	\N	102
1598	25	103	2026-04-15	present	\N	102
1599	25	104	2026-04-15	present	\N	102
1600	25	105	2026-04-15	present	\N	102
1601	25	106	2026-04-15	present	\N	102
1602	25	107	2026-04-15	present	\N	102
1603	25	108	2026-04-15	present	\N	102
1604	25	103	2026-04-16	present	\N	102
1605	25	104	2026-04-16	present	\N	102
1606	25	105	2026-04-16	present	\N	102
1607	25	106	2026-04-16	present	\N	102
1608	25	107	2026-04-16	present	\N	102
1609	25	108	2026-04-16	present	\N	102
1610	25	103	2026-04-17	present	\N	102
1611	25	104	2026-04-17	present	\N	102
1612	25	105	2026-04-17	present	\N	102
1613	25	106	2026-04-17	present	\N	102
1614	25	107	2026-04-17	present	\N	102
1615	25	108	2026-04-17	present	\N	102
1616	25	103	2026-04-18	present	\N	102
1617	25	104	2026-04-18	present	\N	102
1618	25	105	2026-04-18	present	\N	102
1619	25	106	2026-04-18	present	\N	102
1620	25	107	2026-04-18	present	\N	102
1621	25	108	2026-04-18	present	\N	102
1622	25	103	2026-04-19	present	\N	102
1623	25	104	2026-04-19	present	\N	102
1624	25	105	2026-04-19	present	\N	102
1625	25	106	2026-04-19	present	\N	102
1626	25	107	2026-04-19	present	\N	102
1627	25	108	2026-04-19	present	\N	102
1748	27	117	2026-03-31	present	\N	116
1749	27	118	2026-03-31	present	\N	116
1750	27	119	2026-03-31	present	\N	116
1751	27	120	2026-03-31	present	\N	116
1752	27	121	2026-03-31	present	\N	116
1753	27	122	2026-03-31	present	\N	116
1754	27	117	2026-04-01	present	\N	116
1755	27	118	2026-04-01	present	\N	116
1756	27	119	2026-04-01	present	\N	116
1757	27	120	2026-04-01	present	\N	116
1758	27	121	2026-04-01	present	\N	116
1759	27	122	2026-04-01	present	\N	116
1760	27	117	2026-04-02	present	\N	116
1761	27	118	2026-04-02	present	\N	116
1762	27	119	2026-04-02	present	\N	116
1763	27	120	2026-04-02	present	\N	116
1764	27	121	2026-04-02	present	\N	116
1765	27	122	2026-04-02	present	\N	116
1766	27	117	2026-04-03	present	\N	116
1767	27	118	2026-04-03	present	\N	116
1768	27	119	2026-04-03	present	\N	116
1769	27	120	2026-04-03	present	\N	116
1770	27	121	2026-04-03	present	\N	116
1771	27	122	2026-04-03	present	\N	116
1772	27	117	2026-04-04	present	\N	116
1773	27	118	2026-04-04	present	\N	116
1774	27	119	2026-04-04	present	\N	116
1775	27	120	2026-04-04	present	\N	116
1776	27	121	2026-04-04	present	\N	116
1777	27	122	2026-04-04	present	\N	116
1778	27	117	2026-04-05	present	\N	116
1779	27	118	2026-04-05	present	\N	116
1780	27	119	2026-04-05	present	\N	116
1781	27	120	2026-04-05	present	\N	116
1782	27	121	2026-04-05	present	\N	116
1783	27	122	2026-04-05	present	\N	116
1784	27	117	2026-04-06	present	\N	116
1785	27	118	2026-04-06	present	\N	116
1786	27	119	2026-04-06	present	\N	116
1787	27	120	2026-04-06	present	\N	116
1788	27	121	2026-04-06	present	\N	116
1789	27	122	2026-04-06	present	\N	116
1790	27	117	2026-04-07	present	\N	116
1791	27	118	2026-04-07	present	\N	116
1792	27	119	2026-04-07	present	\N	116
1793	27	120	2026-04-07	present	\N	116
1794	27	121	2026-04-07	present	\N	116
1795	27	122	2026-04-07	present	\N	116
1796	27	117	2026-04-08	present	\N	116
1797	27	118	2026-04-08	present	\N	116
1798	27	119	2026-04-08	present	\N	116
1799	27	120	2026-04-08	present	\N	116
1800	27	121	2026-04-08	present	\N	116
1801	27	122	2026-04-08	present	\N	116
1802	27	117	2026-04-09	present	\N	116
1803	27	118	2026-04-09	present	\N	116
1804	27	119	2026-04-09	present	\N	116
1805	27	120	2026-04-09	present	\N	116
1806	27	121	2026-04-09	present	\N	116
1807	27	122	2026-04-09	present	\N	116
1808	27	117	2026-04-10	present	\N	116
1809	27	118	2026-04-10	present	\N	116
1810	27	119	2026-04-10	present	\N	116
1811	27	120	2026-04-10	present	\N	116
1812	27	121	2026-04-10	present	\N	116
1813	27	122	2026-04-10	present	\N	116
1814	27	117	2026-04-11	present	\N	116
1815	27	118	2026-04-11	present	\N	116
1816	27	119	2026-04-11	present	\N	116
1817	27	120	2026-04-11	present	\N	116
1818	27	121	2026-04-11	present	\N	116
1819	27	122	2026-04-11	present	\N	116
1820	27	117	2026-04-12	present	\N	116
1821	27	118	2026-04-12	present	\N	116
1822	27	119	2026-04-12	present	\N	116
1823	27	120	2026-04-12	present	\N	116
1824	27	121	2026-04-12	present	\N	116
1825	27	122	2026-04-12	present	\N	116
1826	27	117	2026-04-13	present	\N	116
1827	27	118	2026-04-13	present	\N	116
1828	27	119	2026-04-13	present	\N	116
1829	27	120	2026-04-13	present	\N	116
1830	27	121	2026-04-13	present	\N	116
1831	27	122	2026-04-13	present	\N	116
1832	27	117	2026-04-14	present	\N	116
1833	27	118	2026-04-14	present	\N	116
1834	27	119	2026-04-14	present	\N	116
1835	27	120	2026-04-14	present	\N	116
1836	27	121	2026-04-14	present	\N	116
1837	27	122	2026-04-14	present	\N	116
1838	27	117	2026-04-15	present	\N	116
1839	27	118	2026-04-15	present	\N	116
1840	27	119	2026-04-15	present	\N	116
1841	27	120	2026-04-15	present	\N	116
1842	27	121	2026-04-15	present	\N	116
1843	27	122	2026-04-15	present	\N	116
1844	27	117	2026-04-16	present	\N	116
1845	27	118	2026-04-16	present	\N	116
1846	27	119	2026-04-16	present	\N	116
1847	27	120	2026-04-16	present	\N	116
1848	27	121	2026-04-16	present	\N	116
1849	27	122	2026-04-16	present	\N	116
1850	27	117	2026-04-17	present	\N	116
1851	27	118	2026-04-17	present	\N	116
1852	27	119	2026-04-17	present	\N	116
1853	27	120	2026-04-17	present	\N	116
1854	27	121	2026-04-17	present	\N	116
1855	27	122	2026-04-17	present	\N	116
1856	27	117	2026-04-18	present	\N	116
1857	27	118	2026-04-18	present	\N	116
1858	27	119	2026-04-18	present	\N	116
1859	27	120	2026-04-18	present	\N	116
1860	27	121	2026-04-18	present	\N	116
1861	27	122	2026-04-18	present	\N	116
1862	27	117	2026-04-19	present	\N	116
1863	27	118	2026-04-19	present	\N	116
1864	27	119	2026-04-19	present	\N	116
1865	27	120	2026-04-19	present	\N	116
1866	27	121	2026-04-19	present	\N	116
1867	27	122	2026-04-19	present	\N	116
1868	28	124	2026-03-31	present	\N	123
1869	28	125	2026-03-31	present	\N	123
1870	28	126	2026-03-31	present	\N	123
1871	28	127	2026-03-31	present	\N	123
1872	28	128	2026-03-31	present	\N	123
1873	28	129	2026-03-31	present	\N	123
1874	28	124	2026-04-01	present	\N	123
1875	28	125	2026-04-01	present	\N	123
1876	28	126	2026-04-01	present	\N	123
1877	28	127	2026-04-01	present	\N	123
1878	28	128	2026-04-01	present	\N	123
1879	28	129	2026-04-01	present	\N	123
1880	28	124	2026-04-02	present	\N	123
1881	28	125	2026-04-02	present	\N	123
1882	28	126	2026-04-02	present	\N	123
1883	28	127	2026-04-02	present	\N	123
1884	28	128	2026-04-02	present	\N	123
1885	28	129	2026-04-02	present	\N	123
1886	28	124	2026-04-03	present	\N	123
1887	28	125	2026-04-03	present	\N	123
1888	28	126	2026-04-03	present	\N	123
1889	28	127	2026-04-03	present	\N	123
1890	28	128	2026-04-03	present	\N	123
1891	28	129	2026-04-03	present	\N	123
1892	28	124	2026-04-04	present	\N	123
1893	28	125	2026-04-04	present	\N	123
1894	28	126	2026-04-04	present	\N	123
1895	28	127	2026-04-04	present	\N	123
1896	28	128	2026-04-04	present	\N	123
1897	28	129	2026-04-04	present	\N	123
1898	28	124	2026-04-05	present	\N	123
1899	28	125	2026-04-05	present	\N	123
1900	28	126	2026-04-05	present	\N	123
1901	28	127	2026-04-05	present	\N	123
1902	28	128	2026-04-05	present	\N	123
1903	28	129	2026-04-05	present	\N	123
1904	28	124	2026-04-06	present	\N	123
1905	28	125	2026-04-06	present	\N	123
1906	28	126	2026-04-06	present	\N	123
1907	28	127	2026-04-06	present	\N	123
1908	28	128	2026-04-06	present	\N	123
1909	28	129	2026-04-06	present	\N	123
1910	28	124	2026-04-07	present	\N	123
1911	28	125	2026-04-07	present	\N	123
1912	28	126	2026-04-07	present	\N	123
1913	28	127	2026-04-07	present	\N	123
1914	28	128	2026-04-07	present	\N	123
1915	28	129	2026-04-07	present	\N	123
1916	28	124	2026-04-08	present	\N	123
1917	28	125	2026-04-08	present	\N	123
1918	28	126	2026-04-08	present	\N	123
1919	28	127	2026-04-08	present	\N	123
1920	28	128	2026-04-08	present	\N	123
1921	28	129	2026-04-08	present	\N	123
1922	28	124	2026-04-09	present	\N	123
1923	28	125	2026-04-09	present	\N	123
1924	28	126	2026-04-09	present	\N	123
1925	28	127	2026-04-09	present	\N	123
1926	28	128	2026-04-09	present	\N	123
1927	28	129	2026-04-09	present	\N	123
1928	28	124	2026-04-10	present	\N	123
1929	28	125	2026-04-10	present	\N	123
1930	28	126	2026-04-10	present	\N	123
1931	28	127	2026-04-10	present	\N	123
1932	28	128	2026-04-10	present	\N	123
1933	28	129	2026-04-10	present	\N	123
1934	28	124	2026-04-11	present	\N	123
1935	28	125	2026-04-11	present	\N	123
1936	28	126	2026-04-11	present	\N	123
1937	28	127	2026-04-11	present	\N	123
1938	28	128	2026-04-11	present	\N	123
1939	28	129	2026-04-11	present	\N	123
1940	28	124	2026-04-12	present	\N	123
1941	28	125	2026-04-12	present	\N	123
1942	28	126	2026-04-12	present	\N	123
1943	28	127	2026-04-12	present	\N	123
1944	28	128	2026-04-12	present	\N	123
1945	28	129	2026-04-12	present	\N	123
1946	28	124	2026-04-13	present	\N	123
1947	28	125	2026-04-13	present	\N	123
1948	28	126	2026-04-13	present	\N	123
1949	28	127	2026-04-13	present	\N	123
1950	28	128	2026-04-13	present	\N	123
1951	28	129	2026-04-13	present	\N	123
1952	28	124	2026-04-14	present	\N	123
1953	28	125	2026-04-14	present	\N	123
1954	28	126	2026-04-14	present	\N	123
1955	28	127	2026-04-14	present	\N	123
1956	28	128	2026-04-14	present	\N	123
1957	28	129	2026-04-14	present	\N	123
1958	28	124	2026-04-15	present	\N	123
1959	28	125	2026-04-15	present	\N	123
1960	28	126	2026-04-15	present	\N	123
1961	28	127	2026-04-15	present	\N	123
1962	28	128	2026-04-15	present	\N	123
1963	28	129	2026-04-15	present	\N	123
1964	28	124	2026-04-16	present	\N	123
1965	28	125	2026-04-16	present	\N	123
1966	28	126	2026-04-16	present	\N	123
1967	28	127	2026-04-16	present	\N	123
1968	28	128	2026-04-16	present	\N	123
1969	28	129	2026-04-16	present	\N	123
1970	28	124	2026-04-17	present	\N	123
1971	28	125	2026-04-17	present	\N	123
1972	28	126	2026-04-17	present	\N	123
1973	28	127	2026-04-17	present	\N	123
1974	28	128	2026-04-17	present	\N	123
1975	28	129	2026-04-17	present	\N	123
1976	28	124	2026-04-18	present	\N	123
1977	28	125	2026-04-18	present	\N	123
1978	28	126	2026-04-18	present	\N	123
1979	28	127	2026-04-18	present	\N	123
1980	28	128	2026-04-18	present	\N	123
1981	28	129	2026-04-18	present	\N	123
1982	28	124	2026-04-19	present	\N	123
1983	28	125	2026-04-19	present	\N	123
1984	28	126	2026-04-19	present	\N	123
1985	28	127	2026-04-19	present	\N	123
1986	28	128	2026-04-19	present	\N	123
1987	28	129	2026-04-19	present	\N	123
1988	29	131	2026-03-31	present	\N	130
1989	29	132	2026-03-31	present	\N	130
1990	29	133	2026-03-31	present	\N	130
1991	29	134	2026-03-31	present	\N	130
1992	29	135	2026-03-31	present	\N	130
1993	29	136	2026-03-31	present	\N	130
1994	29	131	2026-04-01	present	\N	130
1995	29	132	2026-04-01	present	\N	130
1996	29	133	2026-04-01	present	\N	130
1997	29	134	2026-04-01	present	\N	130
1998	29	135	2026-04-01	present	\N	130
1999	29	136	2026-04-01	present	\N	130
2000	29	131	2026-04-02	present	\N	130
2001	29	132	2026-04-02	present	\N	130
2002	29	133	2026-04-02	present	\N	130
2003	29	134	2026-04-02	present	\N	130
2004	29	135	2026-04-02	present	\N	130
2005	29	136	2026-04-02	present	\N	130
2006	29	131	2026-04-03	present	\N	130
2007	29	132	2026-04-03	present	\N	130
2008	29	133	2026-04-03	present	\N	130
2009	29	134	2026-04-03	present	\N	130
2010	29	135	2026-04-03	present	\N	130
2011	29	136	2026-04-03	present	\N	130
2012	29	131	2026-04-04	present	\N	130
2013	29	132	2026-04-04	present	\N	130
2014	29	133	2026-04-04	present	\N	130
2015	29	134	2026-04-04	present	\N	130
2016	29	135	2026-04-04	present	\N	130
2017	29	136	2026-04-04	present	\N	130
2018	29	131	2026-04-05	present	\N	130
2019	29	132	2026-04-05	present	\N	130
2020	29	133	2026-04-05	present	\N	130
2021	29	134	2026-04-05	present	\N	130
2022	29	135	2026-04-05	present	\N	130
2023	29	136	2026-04-05	present	\N	130
2024	29	131	2026-04-06	present	\N	130
2025	29	132	2026-04-06	present	\N	130
2026	29	133	2026-04-06	present	\N	130
2027	29	134	2026-04-06	present	\N	130
2028	29	135	2026-04-06	present	\N	130
2029	29	136	2026-04-06	present	\N	130
2030	29	131	2026-04-07	present	\N	130
2031	29	132	2026-04-07	present	\N	130
2032	29	133	2026-04-07	present	\N	130
2033	29	134	2026-04-07	present	\N	130
2034	29	135	2026-04-07	present	\N	130
2035	29	136	2026-04-07	present	\N	130
2036	29	131	2026-04-08	present	\N	130
2037	29	132	2026-04-08	present	\N	130
2038	29	133	2026-04-08	present	\N	130
2039	29	134	2026-04-08	present	\N	130
2040	29	135	2026-04-08	present	\N	130
2041	29	136	2026-04-08	present	\N	130
2042	29	131	2026-04-09	present	\N	130
2043	29	132	2026-04-09	present	\N	130
2044	29	133	2026-04-09	present	\N	130
2045	29	134	2026-04-09	present	\N	130
2046	29	135	2026-04-09	present	\N	130
2047	29	136	2026-04-09	present	\N	130
2048	29	131	2026-04-10	present	\N	130
2049	29	132	2026-04-10	present	\N	130
2050	29	133	2026-04-10	present	\N	130
2051	29	134	2026-04-10	present	\N	130
2052	29	135	2026-04-10	present	\N	130
2053	29	136	2026-04-10	present	\N	130
2054	29	131	2026-04-11	present	\N	130
2055	29	132	2026-04-11	present	\N	130
2056	29	133	2026-04-11	present	\N	130
2057	29	134	2026-04-11	present	\N	130
2058	29	135	2026-04-11	present	\N	130
2059	29	136	2026-04-11	present	\N	130
2060	29	131	2026-04-12	present	\N	130
2061	29	132	2026-04-12	present	\N	130
2062	29	133	2026-04-12	present	\N	130
2063	29	134	2026-04-12	present	\N	130
2064	29	135	2026-04-12	present	\N	130
2065	29	136	2026-04-12	present	\N	130
2066	29	131	2026-04-13	present	\N	130
2067	29	132	2026-04-13	present	\N	130
2068	29	133	2026-04-13	present	\N	130
2069	29	134	2026-04-13	present	\N	130
2070	29	135	2026-04-13	present	\N	130
2071	29	136	2026-04-13	present	\N	130
2072	29	131	2026-04-14	present	\N	130
2073	29	132	2026-04-14	present	\N	130
2074	29	133	2026-04-14	present	\N	130
2075	29	134	2026-04-14	present	\N	130
2076	29	135	2026-04-14	present	\N	130
2077	29	136	2026-04-14	present	\N	130
2078	29	131	2026-04-15	present	\N	130
2079	29	132	2026-04-15	present	\N	130
2080	29	133	2026-04-15	present	\N	130
2081	29	134	2026-04-15	present	\N	130
2082	29	135	2026-04-15	present	\N	130
2083	29	136	2026-04-15	present	\N	130
2084	29	131	2026-04-16	present	\N	130
2085	29	132	2026-04-16	present	\N	130
2086	29	133	2026-04-16	present	\N	130
2087	29	134	2026-04-16	present	\N	130
2088	29	135	2026-04-16	present	\N	130
2089	29	136	2026-04-16	present	\N	130
2090	29	131	2026-04-17	present	\N	130
2091	29	132	2026-04-17	present	\N	130
2092	29	133	2026-04-17	present	\N	130
2093	29	134	2026-04-17	present	\N	130
2094	29	135	2026-04-17	present	\N	130
2095	29	136	2026-04-17	present	\N	130
2096	29	131	2026-04-18	present	\N	130
2097	29	132	2026-04-18	present	\N	130
2098	29	133	2026-04-18	present	\N	130
2099	29	134	2026-04-18	present	\N	130
2100	29	135	2026-04-18	present	\N	130
2101	29	136	2026-04-18	present	\N	130
2102	29	131	2026-04-19	present	\N	130
2103	29	132	2026-04-19	present	\N	130
2104	29	133	2026-04-19	present	\N	130
2105	29	134	2026-04-19	present	\N	130
2106	29	135	2026-04-19	present	\N	130
2107	29	136	2026-04-19	present	\N	130
2114	30	138	2026-04-01	present	\N	137
2115	30	139	2026-04-01	present	\N	137
2116	30	140	2026-04-01	present	\N	137
2117	30	141	2026-04-01	present	\N	137
2118	30	142	2026-04-01	present	\N	137
2119	30	143	2026-04-01	present	\N	137
2120	30	138	2026-04-02	present	\N	137
2121	30	139	2026-04-02	present	\N	137
2122	30	140	2026-04-02	present	\N	137
2123	30	141	2026-04-02	present	\N	137
2124	30	142	2026-04-02	present	\N	137
2125	30	143	2026-04-02	present	\N	137
2126	30	138	2026-04-03	present	\N	137
2127	30	139	2026-04-03	present	\N	137
2128	30	140	2026-04-03	present	\N	137
2129	30	141	2026-04-03	present	\N	137
2130	30	142	2026-04-03	present	\N	137
2131	30	143	2026-04-03	present	\N	137
2132	30	138	2026-04-04	present	\N	137
2133	30	139	2026-04-04	present	\N	137
2134	30	140	2026-04-04	present	\N	137
2135	30	141	2026-04-04	present	\N	137
2136	30	142	2026-04-04	present	\N	137
2137	30	143	2026-04-04	present	\N	137
2138	30	138	2026-04-05	present	\N	137
2139	30	139	2026-04-05	present	\N	137
2140	30	140	2026-04-05	present	\N	137
2141	30	141	2026-04-05	present	\N	137
2142	30	142	2026-04-05	present	\N	137
2143	30	143	2026-04-05	present	\N	137
2144	30	138	2026-04-06	present	\N	137
2145	30	139	2026-04-06	present	\N	137
2146	30	140	2026-04-06	present	\N	137
2147	30	141	2026-04-06	present	\N	137
2148	30	142	2026-04-06	present	\N	137
2149	30	143	2026-04-06	present	\N	137
2150	30	138	2026-04-07	present	\N	137
2151	30	139	2026-04-07	present	\N	137
2152	30	140	2026-04-07	present	\N	137
2153	30	141	2026-04-07	present	\N	137
2154	30	142	2026-04-07	present	\N	137
2155	30	143	2026-04-07	present	\N	137
2156	30	138	2026-04-08	present	\N	137
2157	30	139	2026-04-08	present	\N	137
2158	30	140	2026-04-08	present	\N	137
2159	30	141	2026-04-08	present	\N	137
2160	30	142	2026-04-08	present	\N	137
2161	30	143	2026-04-08	present	\N	137
2162	30	138	2026-04-09	present	\N	137
2163	30	139	2026-04-09	present	\N	137
2164	30	140	2026-04-09	present	\N	137
2165	30	141	2026-04-09	present	\N	137
2166	30	142	2026-04-09	present	\N	137
2167	30	143	2026-04-09	present	\N	137
2168	30	138	2026-04-10	present	\N	137
2169	30	139	2026-04-10	present	\N	137
2170	30	140	2026-04-10	present	\N	137
2171	30	141	2026-04-10	present	\N	137
2172	30	142	2026-04-10	present	\N	137
2173	30	143	2026-04-10	present	\N	137
2174	30	138	2026-04-11	present	\N	137
2175	30	139	2026-04-11	present	\N	137
2176	30	140	2026-04-11	present	\N	137
2177	30	141	2026-04-11	present	\N	137
2178	30	142	2026-04-11	present	\N	137
2179	30	143	2026-04-11	present	\N	137
2180	30	138	2026-04-12	present	\N	137
2181	30	139	2026-04-12	present	\N	137
2182	30	140	2026-04-12	present	\N	137
2183	30	141	2026-04-12	present	\N	137
2184	30	142	2026-04-12	present	\N	137
2185	30	143	2026-04-12	present	\N	137
2186	30	138	2026-04-13	present	\N	137
2187	30	139	2026-04-13	present	\N	137
2188	30	140	2026-04-13	present	\N	137
2189	30	141	2026-04-13	present	\N	137
2190	30	142	2026-04-13	present	\N	137
2191	30	143	2026-04-13	present	\N	137
2192	30	138	2026-04-14	present	\N	137
2193	30	139	2026-04-14	present	\N	137
2194	30	140	2026-04-14	present	\N	137
2195	30	141	2026-04-14	present	\N	137
2196	30	142	2026-04-14	present	\N	137
2197	30	143	2026-04-14	present	\N	137
2198	30	138	2026-04-15	present	\N	137
2199	30	139	2026-04-15	present	\N	137
2200	30	140	2026-04-15	present	\N	137
2201	30	141	2026-04-15	present	\N	137
2202	30	142	2026-04-15	present	\N	137
2203	30	143	2026-04-15	present	\N	137
2204	30	138	2026-04-16	present	\N	137
2205	30	139	2026-04-16	present	\N	137
2206	30	140	2026-04-16	present	\N	137
2207	30	141	2026-04-16	present	\N	137
2208	30	142	2026-04-16	present	\N	137
2209	30	143	2026-04-16	present	\N	137
2210	30	138	2026-04-17	present	\N	137
2211	30	139	2026-04-17	present	\N	137
2212	30	140	2026-04-17	present	\N	137
2213	30	141	2026-04-17	present	\N	137
2214	30	142	2026-04-17	present	\N	137
2215	30	143	2026-04-17	present	\N	137
2216	30	138	2026-04-18	present	\N	137
2217	30	139	2026-04-18	present	\N	137
2218	30	140	2026-04-18	present	\N	137
2219	30	141	2026-04-18	present	\N	137
2220	30	142	2026-04-18	present	\N	137
2221	30	143	2026-04-18	present	\N	137
2222	30	138	2026-04-19	present	\N	137
2223	30	139	2026-04-19	present	\N	137
2224	30	140	2026-04-19	present	\N	137
2225	30	141	2026-04-19	present	\N	137
2226	30	142	2026-04-19	present	\N	137
2227	30	143	2026-04-19	present	\N	137
2228	30	138	2026-03-31	present	\N	137
2229	30	139	2026-03-31	present	\N	137
2230	30	140	2026-03-31	present	\N	137
2231	30	141	2026-03-31	present	\N	137
2232	30	142	2026-03-31	present	\N	137
2233	30	143	2026-03-31	present	\N	137
2234	33	146	2026-04-01	present	\N	144
2235	34	147	2026-04-01	present	\N	145
2236	33	149	2026-04-01	present	\N	144
2237	34	148	2026-04-01	present	\N	145
2238	34	150	2026-04-01	present	\N	145
2239	33	151	2026-04-01	present	\N	144
2240	34	152	2026-04-01	present	\N	145
2241	33	153	2026-04-01	present	\N	144
2242	34	154	2026-04-01	present	\N	145
2243	33	155	2026-04-01	present	\N	144
2244	34	156	2026-04-01	present	\N	145
2245	33	157	2026-04-01	present	\N	144
2246	34	147	2026-04-02	present	\N	145
2247	33	146	2026-04-02	present	\N	144
2248	34	148	2026-04-02	present	\N	145
2249	33	149	2026-04-02	present	\N	144
2250	34	150	2026-04-02	present	\N	145
2251	33	151	2026-04-02	present	\N	144
2252	34	152	2026-04-02	present	\N	145
2253	33	153	2026-04-02	present	\N	144
2254	34	154	2026-04-02	present	\N	145
2255	33	155	2026-04-02	present	\N	144
2256	34	156	2026-04-02	present	\N	145
2257	33	157	2026-04-02	present	\N	144
2258	34	147	2026-04-03	present	\N	145
2259	34	148	2026-04-03	present	\N	145
2260	33	146	2026-04-03	present	\N	144
2261	34	150	2026-04-03	present	\N	145
2262	33	149	2026-04-03	present	\N	144
2263	34	152	2026-04-03	present	\N	145
2264	33	151	2026-04-03	present	\N	144
2265	34	154	2026-04-03	present	\N	145
2266	33	153	2026-04-03	present	\N	144
2267	34	156	2026-04-03	present	\N	145
2268	33	155	2026-04-03	present	\N	144
2269	33	157	2026-04-03	present	\N	144
2270	34	147	2026-04-04	present	\N	145
2271	34	148	2026-04-04	present	\N	145
2272	33	146	2026-04-04	present	\N	144
2273	34	150	2026-04-04	present	\N	145
2274	33	149	2026-04-04	present	\N	144
2275	34	152	2026-04-04	present	\N	145
2276	33	151	2026-04-04	present	\N	144
2277	34	154	2026-04-04	present	\N	145
2278	33	153	2026-04-04	present	\N	144
2279	34	156	2026-04-04	present	\N	145
2280	33	155	2026-04-04	present	\N	144
2281	33	157	2026-04-04	present	\N	144
2282	34	147	2026-04-05	present	\N	145
2283	34	148	2026-04-05	present	\N	145
2284	33	146	2026-04-05	present	\N	144
2285	34	150	2026-04-05	present	\N	145
2286	33	149	2026-04-05	present	\N	144
2287	34	152	2026-04-05	present	\N	145
2288	33	151	2026-04-05	present	\N	144
2289	34	154	2026-04-05	present	\N	145
2290	33	153	2026-04-05	present	\N	144
2291	34	156	2026-04-05	present	\N	145
2292	33	155	2026-04-05	present	\N	144
2293	33	157	2026-04-05	present	\N	144
2294	34	147	2026-04-06	present	\N	145
2295	34	148	2026-04-06	present	\N	145
2296	33	146	2026-04-06	present	\N	144
2297	34	150	2026-04-06	present	\N	145
2298	33	149	2026-04-06	present	\N	144
2299	34	152	2026-04-06	present	\N	145
2300	33	151	2026-04-06	present	\N	144
2301	34	154	2026-04-06	present	\N	145
2302	33	153	2026-04-06	present	\N	144
2303	34	156	2026-04-06	present	\N	145
2304	33	155	2026-04-06	present	\N	144
2305	34	147	2026-04-07	present	\N	145
2306	33	157	2026-04-06	present	\N	144
2307	34	148	2026-04-07	present	\N	145
2308	34	150	2026-04-07	present	\N	145
2309	34	152	2026-04-07	present	\N	145
2310	34	154	2026-04-07	present	\N	145
2311	34	156	2026-04-07	present	\N	145
2312	33	146	2026-04-07	present	\N	144
2313	34	147	2026-04-08	present	\N	145
2315	34	148	2026-04-08	present	\N	145
2317	34	150	2026-04-08	present	\N	145
2319	34	152	2026-04-08	present	\N	145
2321	34	154	2026-04-08	present	\N	145
2323	34	156	2026-04-08	present	\N	145
2325	34	147	2026-04-09	present	\N	145
2327	34	148	2026-04-09	present	\N	145
2329	34	150	2026-04-09	present	\N	145
2331	34	152	2026-04-09	present	\N	145
2333	34	154	2026-04-09	present	\N	145
2335	34	156	2026-04-09	present	\N	145
2337	34	147	2026-04-10	present	\N	145
2339	34	148	2026-04-10	present	\N	145
2341	34	150	2026-04-10	present	\N	145
2343	34	152	2026-04-10	present	\N	145
2345	34	154	2026-04-10	present	\N	145
2347	34	156	2026-04-10	present	\N	145
2349	34	147	2026-04-11	present	\N	145
2351	34	148	2026-04-11	present	\N	145
2353	34	150	2026-04-11	present	\N	145
2354	34	152	2026-04-11	present	\N	145
2356	34	154	2026-04-11	present	\N	145
2358	34	156	2026-04-11	present	\N	145
2360	34	147	2026-04-12	present	\N	145
2362	34	148	2026-04-12	present	\N	145
2364	34	150	2026-04-12	present	\N	145
2366	34	152	2026-04-12	present	\N	145
2368	34	154	2026-04-12	present	\N	145
2370	34	156	2026-04-12	present	\N	145
2372	34	147	2026-04-13	present	\N	145
2373	34	148	2026-04-13	present	\N	145
2375	34	150	2026-04-13	present	\N	145
2377	34	152	2026-04-13	present	\N	145
2379	34	154	2026-04-13	present	\N	145
2381	34	156	2026-04-13	present	\N	145
2384	34	147	2026-04-14	present	\N	145
2385	34	148	2026-04-14	present	\N	145
2387	34	150	2026-04-14	present	\N	145
2389	34	152	2026-04-14	present	\N	145
2391	34	154	2026-04-14	present	\N	145
2393	34	156	2026-04-14	present	\N	145
2396	34	147	2026-04-15	present	\N	145
2397	34	148	2026-04-15	present	\N	145
2399	34	150	2026-04-15	present	\N	145
2401	34	152	2026-04-15	present	\N	145
2403	34	154	2026-04-15	present	\N	145
2405	34	156	2026-04-15	present	\N	145
2408	34	147	2026-04-16	present	\N	145
2409	34	148	2026-04-16	present	\N	145
2411	34	150	2026-04-16	present	\N	145
2413	34	152	2026-04-16	present	\N	145
2415	34	154	2026-04-16	present	\N	145
2417	34	156	2026-04-16	present	\N	145
2420	34	147	2026-04-17	present	\N	145
2421	34	148	2026-04-17	present	\N	145
2422	34	150	2026-04-17	present	\N	145
2423	34	152	2026-04-17	present	\N	145
2424	34	154	2026-04-17	present	\N	145
2425	34	156	2026-04-17	present	\N	145
2427	34	147	2026-04-18	present	\N	145
2429	34	148	2026-04-18	present	\N	145
2431	34	150	2026-04-18	present	\N	145
2433	34	152	2026-04-18	present	\N	145
2435	34	154	2026-04-18	present	\N	145
2437	34	156	2026-04-18	present	\N	145
2439	34	147	2026-04-19	present	\N	145
2441	34	148	2026-04-19	present	\N	145
2443	34	150	2026-04-19	present	\N	145
2445	34	152	2026-04-19	present	\N	145
2447	34	154	2026-04-19	present	\N	145
2449	34	156	2026-04-19	present	\N	145
2451	34	147	2026-04-20	present	\N	145
2453	34	148	2026-04-20	present	\N	145
2455	34	150	2026-04-20	present	\N	145
2457	34	152	2026-04-20	present	\N	145
2459	34	154	2026-04-20	present	\N	145
2461	34	156	2026-04-20	present	\N	145
2314	33	149	2026-04-07	present	\N	144
2316	33	151	2026-04-07	present	\N	144
2318	33	153	2026-04-07	present	\N	144
2320	33	155	2026-04-07	present	\N	144
2322	33	157	2026-04-07	present	\N	144
2324	33	146	2026-04-08	present	\N	144
2326	33	149	2026-04-08	present	\N	144
2328	33	151	2026-04-08	present	\N	144
2330	33	153	2026-04-08	present	\N	144
2332	33	155	2026-04-08	present	\N	144
2334	33	157	2026-04-08	present	\N	144
2336	33	146	2026-04-09	present	\N	144
2338	33	149	2026-04-09	present	\N	144
2340	33	151	2026-04-09	present	\N	144
2342	33	153	2026-04-09	present	\N	144
2344	33	155	2026-04-09	present	\N	144
2346	33	157	2026-04-09	present	\N	144
2348	33	146	2026-04-10	present	\N	144
2350	33	149	2026-04-10	present	\N	144
2352	33	151	2026-04-10	present	\N	144
2355	33	153	2026-04-10	present	\N	144
2357	33	155	2026-04-10	present	\N	144
2359	33	157	2026-04-10	present	\N	144
2361	33	146	2026-04-11	present	\N	144
2363	33	149	2026-04-11	present	\N	144
2365	33	151	2026-04-11	present	\N	144
2367	33	153	2026-04-11	present	\N	144
2369	33	155	2026-04-11	present	\N	144
2371	33	157	2026-04-11	present	\N	144
2374	33	146	2026-04-12	present	\N	144
2376	33	149	2026-04-12	present	\N	144
2378	33	151	2026-04-12	present	\N	144
2380	33	153	2026-04-12	present	\N	144
2382	33	155	2026-04-12	present	\N	144
2383	33	157	2026-04-12	present	\N	144
2386	33	146	2026-04-13	present	\N	144
2388	33	149	2026-04-13	present	\N	144
2390	33	151	2026-04-13	present	\N	144
2392	33	153	2026-04-13	present	\N	144
2394	33	155	2026-04-13	present	\N	144
2395	33	157	2026-04-13	present	\N	144
2398	33	146	2026-04-14	present	\N	144
2400	33	149	2026-04-14	present	\N	144
2402	33	151	2026-04-14	present	\N	144
2404	33	153	2026-04-14	present	\N	144
2406	33	155	2026-04-14	present	\N	144
2407	33	157	2026-04-14	present	\N	144
2410	33	146	2026-04-15	present	\N	144
2412	33	149	2026-04-15	present	\N	144
2414	33	151	2026-04-15	present	\N	144
2416	33	153	2026-04-15	present	\N	144
2418	33	155	2026-04-15	present	\N	144
2419	33	157	2026-04-15	present	\N	144
2426	33	146	2026-04-16	present	\N	144
2428	33	149	2026-04-16	present	\N	144
2430	33	151	2026-04-16	present	\N	144
2432	33	153	2026-04-16	present	\N	144
2434	33	155	2026-04-16	present	\N	144
2436	33	157	2026-04-16	present	\N	144
2438	33	146	2026-04-17	present	\N	144
2440	33	149	2026-04-17	present	\N	144
2442	33	151	2026-04-17	present	\N	144
2444	33	153	2026-04-17	present	\N	144
2446	33	155	2026-04-17	present	\N	144
2448	33	157	2026-04-17	present	\N	144
2450	33	146	2026-04-18	present	\N	144
2452	33	149	2026-04-18	present	\N	144
2454	33	151	2026-04-18	present	\N	144
2456	33	153	2026-04-18	present	\N	144
2458	33	155	2026-04-18	present	\N	144
2460	33	157	2026-04-18	present	\N	144
2462	33	146	2026-04-19	present	\N	144
2463	33	149	2026-04-19	present	\N	144
2464	33	151	2026-04-19	present	\N	144
2465	33	153	2026-04-19	present	\N	144
2466	33	155	2026-04-19	present	\N	144
2467	33	157	2026-04-19	present	\N	144
2468	33	146	2026-04-20	present	\N	144
2469	33	149	2026-04-20	present	\N	144
2470	33	151	2026-04-20	present	\N	144
2471	33	153	2026-04-20	present	\N	144
2472	33	155	2026-04-20	present	\N	144
2473	33	157	2026-04-20	present	\N	144
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.documents (id, file_id, content_json) FROM stdin;
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.files (id, name, tag, file_type, date, building_site_id, owner_id, uploaded_at, storage_key, is_generated, project_id) FROM stdin;
94	cartellone.pdf	\N	application/pdf	2026-03-13	12	67	2026-03-13 14:54:45.008269	uploads/358c17e8-f1e5-4151-bdd7-215ae4d157e5-site12.pdf	f	\N
95	header.png	\N	image/png	2026-03-13	12	67	2026-03-13 14:54:45.012992	uploads/60eb45de-fdda-40bd-b1de-7215f48ee5cf-site12.png	f	\N
96	cartellone sistemato.pdf	\N	application/pdf	2026-03-13	12	67	2026-03-13 14:54:45.026692	uploads/a27fb747-e047-40f3-b2fe-4a3a866e6cb2-site12.pdf	f	\N
97	header 1.jpg	\N	image/jpeg	2026-03-13	12	67	2026-03-13 14:54:45.10425	uploads/3893fbd3-055a-4e13-be83-de1769495859-site12.jpg	f	\N
98	insegna petraleuka (corsivo).pdf	\N	application/pdf	2026-03-13	12	67	2026-03-13 14:54:45.233792	uploads/099cd9a1-7f83-451e-9324-0322dc38df66-site12.pdf	f	\N
107	immagine di prova.jpeg	\N	image/jpeg	2026-03-28	21	74	2026-03-29 00:51:23.816421	uploads/20edb1f3-7969-493d-b0c1-e3f210e5595f-site21.jpeg	f	\N
108	immagine di prova.jpeg	\N	image/jpeg	2026-03-29	21	74	2026-03-29 01:21:57.016171	uploads/383dfaf6-7829-41c0-a04f-8369f35826e0-site21.jpeg	f	\N
109	certificato Gabriele Buttice.pdf	\N	application/pdf	2026-03-29	21	74	2026-03-29 01:22:21.829981	uploads/53cbc279-5a79-4e1e-b208-a5cfbac9538c-site21.pdf	f	\N
110	immagine di prova.jpeg	\N	image/jpeg	2026-03-29	21	74	2026-03-29 01:24:25.247	uploads/413554d4-ac45-4520-9fc7-30f8cc8cd789-site21.jpeg	f	\N
111	Verbale di soprallugo.pdf	\N	application/pdf	2026-03-29	21	74	2026-03-29 01:26:10.857112	uploads/ed4e4c56-2b69-408c-8ad8-3f62156eea9e-site21.pdf	f	46
113	Verbale di soprallugo (2).pdf	\N	application/pdf	2026-03-29	21	74	2026-03-29 01:43:44.888772	uploads/e08a8445-6d4e-4bec-8bc4-9270151677e7-site21.pdf	f	46
114	Verbale di soprallugo (3).pdf	\N	application/pdf	2026-03-29	21	74	2026-03-29 01:44:35.930522	uploads/754dc468-09de-4b67-93e4-f21b49b3d9f1-site21.pdf	f	46
100	immagine di prova.jpeg	\N	image/jpeg	2026-03-25	21	74	2026-03-25 21:54:37.213413	uploads/aa82cd13-82c5-4c4a-9ef4-69161a83c1a6-site21.jpeg	f	\N
101	immagine di prova.jpeg	\N	image/jpeg	2026-03-28	21	74	2026-03-28 13:56:30.402354	uploads/974ee3c0-608d-4f5b-8302-5cf3edfda43e-site21.jpeg	f	\N
102	BustaPaga_GABRIELE_BUTTICE'_Febbraio_2026.pdf	\N	application/pdf	2026-03-28	21	74	2026-03-28 13:56:35.222471	uploads/c89346b0-2d6f-4deb-ba85-58782211ecfb-site21.pdf	f	\N
103	APP DEMO NAUTICA_fx ANCORA.pdf	\N	application/pdf	2026-03-28	21	74	2026-03-28 13:56:36.345002	uploads/7a4287f2-88f6-419a-a861-a7fdb46ee6eb-site21.pdf	f	\N
104	1945878_0.pdf	\N	application/pdf	2026-03-28	21	74	2026-03-28 13:56:36.942332	uploads/bbed5998-4d8a-46ae-8166-d126d7729474-site21.pdf	f	\N
105	certificato Gabriele Buttice.pdf	\N	application/pdf	2026-03-28	21	74	2026-03-28 13:56:38.336729	uploads/abd27f6b-2531-4fb5-84c3-208a91d144e3-site21.pdf	f	\N
106	certificato Gabriele Buttice.jpg	\N	image/jpeg	2026-03-28	21	74	2026-03-28 13:56:40.004289	uploads/abdbd87b-5599-4739-a990-02e0ea3661bb-site21.jpg	f	\N
115	immagine scaduta.pdf	\N	application/pdf	2026-03-29	21	74	2026-03-29 01:46:34.97408	uploads/c463f0ca-798a-4404-afc1-1f14d1717244-site21.pdf	f	48
116	Verbale di soprallugo (4).pdf	\N	application/pdf	2026-03-29	21	74	2026-03-29 01:55:59.224795	uploads/fc8f4829-5012-4714-aefb-e51917f87327-site21.pdf	f	46
117	Progetto senza titolo.pdf	\N	application/pdf	2026-02-25	21	74	2026-03-29 03:02:54.144285	uploads/3fd91fc2-8c23-4338-8574-bd029e534e88-site21.pdf	f	49
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.projects (id, name, content_json, metadata, created_at, updated_at, owner_id, building_site_id, date) FROM stdin;
51	Verbale sulla sicurezza	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "VERBALE DI SOPRALLUOGO E COORDINAMENTO SICUREZZA", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome del Cantiere / Indirizzo] ", "type": "text"}, {"text": "Data:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [GG/MM/AAAA] | ", "type": "text"}, {"text": "Ora:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ", "type": "text"}, {"text": "Verbale n°:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Numero progressivo]", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "1. PARTECIPANTI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Direttore Lavori (DL):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome e Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Coord. Sicurezza (CSE):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome e Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Impresa Affidataria:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] - Rappresentante: [Nome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Imprese Esecutrici/Subappalti:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] - Rappresentante: [Nome]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "2. STATO DEI LAVORI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Fase lavorativa in corso:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Es. Scavi, montaggio ponteggi, getto solai]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Aree visionate:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Specificare i piani o le zone del cantiere]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "3. VERIFICHE EFFETTUATE (Checklist rapida)", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Recinzioni e accessi:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Conformi / Non conformi", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "DPI (Caschi, scarpe, imbracature):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Corretto utilizzo / Richiamo effettuato", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Apprestamenti (Ponteggi, parapetti):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Integri / Da revisionare", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Documentazione (POS, tesserini):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Aggiornata / Da integrare", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Impianto elettrico di cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Certificato / Integro", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "4. OSSERVAZIONI E PRESCRIZIONI DEL CSE", "type": "text"}]}, {"type": "blockquote", "content": [{"type": "paragraph", "content": [{"text": "In questa sezione il Coordinatore riporta eventuali anomalie riscontrate e le azioni correttive richieste.", "type": "text"}]}]}, {"type": "orderedList", "attrs": {"type": null, "start": 1}, "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalia:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Descrizione del rischio riscontrato]", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prescrizione:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Cosa fare per risolvere]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Scadenza:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Entro le ore/data]", "type": "text"}]}]}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalia:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Es. Mancanza segnaletica nell'area X]", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prescrizione:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ripristinare cartellonistica]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Scadenza:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Immediata]", "type": "text"}]}]}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "5. DICHIARAZIONI DELLE IMPRESE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "L'impresa [Nome] prende atto delle osservazioni e si impegna a risolverle entro i termini stabiliti. Note aggiuntive: [Eventuali giustificazioni o richieste].", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "6. FIRME PER ACCETTAZIONE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Il Coordinatore (CSE):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________ ", "type": "text"}, {"text": "L'Impresa Affidataria:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________ ", "type": "text"}, {"text": "L'Impresa Esecutrice:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________", "type": "text"}]}]}	{"source": "template", "template_id": 1}	2026-03-29 14:16:10.127125+00	2026-03-29 14:16:12.305082+00	74	21	2026-03-29
48	immagine scaduta	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Immagine che dovrebbe scadere a breve:", "type": "text"}, {"type": "hardBreak"}]}, {"type": "image", "attrs": {"alt": null, "src": "https://s3.eu-central-003.backblazeb2.com/giornaledeilavori-bucket/uploads/413554d4-ac45-4520-9fc7-30f8cc8cd789-site21.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0037fdd9d2de5e90000000002%2F20260329%2Feu-central-003%2Fs3%2Faws4_request&X-Amz-Date=20260329T002425Z&X-Amz-Expires=3600&X-Amz-Signature=7d8ad7f69a463cc1064bc80f96a34d5d2a74c4f0c07c82afc5535f8250159fc6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject", "title": null, "width": null, "height": null}}, {"type": "paragraph"}]}	{"source": "upload-files-component"}	2026-03-29 00:21:32.542836+00	2026-03-29 00:24:31.572437+00	74	21	2026-03-29
52	Verbale sulla sicurezza	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "VERBALE DI SOPRALLUOGO E COORDINAMENTO SICUREZZA", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome del Cantiere / Indirizzo] ", "type": "text"}, {"text": "Data:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [GG/MM/AAAA] | ", "type": "text"}, {"text": "Ora:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ", "type": "text"}, {"text": "Verbale n°:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Numero progressivo]", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "1. PARTECIPANTI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Direttore Lavori (DL):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome e Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Coord. Sicurezza (CSE):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome e Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Impresa Affidataria:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] - Rappresentante: [Nome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Imprese Esecutrici/Subappalti:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] - Rappresentante: [Nome]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "2. STATO DEI LAVORI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Fase lavorativa in corso:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Es. Scavi, montaggio ponteggi, getto solai]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Aree visionate:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Specificare i piani o le zone del cantiere]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "3. VERIFICHE EFFETTUATE (Checklist rapida)", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Recinzioni e accessi:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Conformi / Non conformi", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "DPI (Caschi, scarpe, imbracature):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Corretto utilizzo / Richiamo effettuato", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Apprestamenti (Ponteggi, parapetti):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Integri / Da revisionare", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Documentazione (POS, tesserini):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Aggiornata / Da integrare", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Impianto elettrico di cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Certificato / Integro", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "4. OSSERVAZIONI E PRESCRIZIONI DEL CSE", "type": "text"}]}, {"type": "blockquote", "content": [{"type": "paragraph", "content": [{"text": "In questa sezione il Coordinatore riporta eventuali anomalie riscontrate e le azioni correttive richieste.", "type": "text"}]}]}, {"type": "orderedList", "attrs": {"type": null, "start": 1}, "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalia:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Descrizione del rischio riscontrato]", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prescrizione:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Cosa fare per risolvere]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Scadenza:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Entro le ore/data]", "type": "text"}]}]}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalia:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Es. Mancanza segnaletica nell'area X]", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prescrizione:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ripristinare cartellonistica]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Scadenza:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Immediata]", "type": "text"}]}]}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "5. DICHIARAZIONI DELLE IMPRESE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "L'impresa [Nome] prende atto delle osservazioni e si impegna a risolverle entro i termini stabiliti. Note aggiuntive: [Eventuali giustificazioni o richieste].", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "6. FIRME PER ACCETTAZIONE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Il Coordinatore (CSE):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________ ", "type": "text"}, {"text": "L'Impresa Affidataria:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________ ", "type": "text"}, {"text": "L'Impresa Esecutrice:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________", "type": "text"}]}]}	{"source": "template", "template_id": 1}	2026-03-29 14:17:05.781353+00	2026-03-29 14:17:07.997356+00	74	21	2026-03-29
53	Progetto senza titolo	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Nuovo documento", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 14:17:31.583491+00	2026-03-29 14:17:31.583491+00	74	21	2026-03-29
46	Verbale di soprallugo	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "VERBALE DI SOPRALLUOGO E DISPOSIZIONI DI SERVIZIO", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome del Cantiere / Codice Commessa] ", "type": "text"}, {"text": "Data:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [GG/MM/AAAA] – ", "type": "text"}, {"text": "Ora:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ", "type": "text"}, {"text": "Sopralluogo n.:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [00]", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "1. SOGGETTI PRESENTI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Direttore dei Lavori:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Arch./Ing. [Nome Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Impresa Esecutrice:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] – Rappresentata da: [Nome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "CSE (se presente):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome Cognome]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "2. STATO DEI LAVORI E ATTIVITÀ IN CORSO", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Alla data odierna risultano in corso le seguenti lavorazioni:", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[Esempio: Montaggio ponteggio sul prospetto Nord]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[Esempio: Scavo di fondazione zona B]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "3. OSSERVAZIONI SULLA SICUREZZA", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "In relazione alle lavorazioni osservate, si rileva quanto segue:", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Apprestamenti:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Esempio: Le recinzioni di cantiere risultano integre e correttamente posizionate].", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "DPI:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Esempio: Tutto il personale presente risulta munito di casco, calzature antinfortunistiche e gilet ad alta visibilità].", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalie Riscontrate:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " * ", "type": "text"}, {"text": "Esempio:", "type": "text", "marks": [{"type": "italic"}]}, {"text": " Si osserva la mancanza di protezione terminale (parapetto) su una porzione della piattaforma di carico al piano primo.", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Esempio:", "type": "text", "marks": [{"type": "italic"}]}, {"text": " Presenza di materiale di risulta che ostruisce le vie di esodo interne.", "type": "text"}]}]}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "4. DISPOSIZIONI DEL DIRETTORE DEI LAVORI", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Ai sensi delle responsabilità di alta vigilanza, il sottoscritto DL dispone che l'Impresa provveda immediatamente a:", "type": "text"}]}, {"type": "orderedList", "attrs": {"type": null, "start": 1}, "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Ripristinare i parapetti", "type": "text", "marks": [{"type": "bold"}]}, {"text": " mancanti entro e non oltre le ore del giorno [Data].", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Sgombrare le aree di transito", "type": "text", "marks": [{"type": "bold"}]}, {"text": " dai detriti per garantire il passaggio sicuro dei lavoratori.", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Sospendere temporaneamente", "type": "text", "marks": [{"type": "bold"}]}, {"text": " la specifica lavorazione in quota fino al ripristino delle condizioni di sicurezza (se necessario).", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "5. COMUNICAZIONI AL CSE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "(Opzionale, se sono state riscontrate gravi inadempienze)", "type": "text", "marks": [{"type": "italic"}]}, {"text": " Il presente verbale viene trasmesso al Coordinatore per l’Esecuzione (CSE) per le valutazioni di competenza ai sensi del D.Lgs. 81/08.", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "paragraph", "content": [{"text": "Note aggiuntive:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Spazio per eventuali note dell'impresa]", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Firme per presa visione e accettazione:", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "horizontalRule"}, {"type": "paragraph", "content": [{"text": "Il Direttore dei Lavori", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "horizontalRule"}, {"type": "paragraph", "content": [{"text": "Il Responsabile di Cantiere (Impresa)", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "VERBALE DI SOPRALLUOGO E DISPOSIZIONI DI SERVIZIO", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome del Cantiere / Codice Commessa] ", "type": "text"}, {"text": "Data:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [GG/MM/AAAA] – ", "type": "text"}, {"text": "Ora:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ", "type": "text"}, {"text": "Sopralluogo n.:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [00]", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "1. SOGGETTI PRESENTI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Direttore dei Lavori:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Arch./Ing. [Nome Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Impresa Esecutrice:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] – Rappresentata da: [Nome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "CSE (se presente):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome Cognome]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "2. STATO DEI LAVORI E ATTIVITÀ IN CORSO", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Alla data odierna risultano in corso le seguenti lavorazioni:", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[Esempio: Montaggio ponteggio sul prospetto Nord]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[Esempio: Scavo di fondazione zona B]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "3. OSSERVAZIONI SULLA SICUREZZA", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "In relazione alle lavorazioni osservate, si rileva quanto segue:", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Apprestamenti:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Esempio: Le recinzioni di cantiere risultano integre e correttamente posizionate].", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "DPI:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Esempio: Tutto il personale presente risulta munito di casco, calzature antinfortunistiche e gilet ad alta visibilità].", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalie Riscontrate:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " * ", "type": "text"}, {"text": "Esempio:", "type": "text", "marks": [{"type": "italic"}]}, {"text": " Si osserva la mancanza di protezione terminale (parapetto) su una porzione della piattaforma di carico al piano primo.", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Esempio:", "type": "text", "marks": [{"type": "italic"}]}, {"text": " Presenza di materiale di risulta che ostruisce le vie di esodo interne.", "type": "text"}]}]}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "4. DISPOSIZIONI DEL DIRETTORE DEI LAVORI", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Ai sensi delle responsabilità di alta vigilanza, il sottoscritto DL dispone che l'Impresa provveda immediatamente a:", "type": "text"}]}, {"type": "orderedList", "attrs": {"type": null, "start": 1}, "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Ripristinare i parapetti", "type": "text", "marks": [{"type": "bold"}]}, {"text": " mancanti entro e non oltre le ore del giorno [Data].", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Sgombrare le aree di transito", "type": "text", "marks": [{"type": "bold"}]}, {"text": " dai detriti per garantire il passaggio sicuro dei lavoratori.", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Sospendere temporaneamente", "type": "text", "marks": [{"type": "bold"}]}, {"text": " la specifica lavorazione in quota fino al ripristino delle condizioni di sicurezza (se necessario).", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "5. COMUNICAZIONI AL CSE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "(Opzionale, se sono state riscontrate gravi inadempienze)", "type": "text", "marks": [{"type": "italic"}]}, {"text": " Il presente verbale viene trasmesso al Coordinatore per l’Esecuzione (CSE) per le valutazioni di competenza ai sensi del D.Lgs. 81/08.", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "paragraph", "content": [{"text": "Note aggiuntive:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Spazio per eventuali note dell'impresa]", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Firme per presa visione e accettazione:", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "horizontalRule"}, {"type": "paragraph", "content": [{"text": "Il Direttore dei Lavori", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "horizontalRule"}, {"type": "paragraph", "content": [{"text": "Il Responsabile di Cantiere (Impresa)", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "VERBALE DI SOPRALLUOGO E DISPOSIZIONI DI SERVIZIO", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome del Cantiere / Codice Commessa] ", "type": "text"}, {"text": "Data:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [GG/MM/AAAA] – ", "type": "text"}, {"text": "Ora:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ", "type": "text"}, {"text": "Sopralluogo n.:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [00]", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "1. SOGGETTI PRESENTI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Direttore dei Lavori:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Arch./Ing. [Nome Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Impresa Esecutrice:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] – Rappresentata da: [Nome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "CSE (se presente):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome Cognome]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "2. STATO DEI LAVORI E ATTIVITÀ IN CORSO", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Alla data odierna risultano in corso le seguenti lavorazioni:", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[Esempio: Montaggio ponteggio sul prospetto Nord]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[Esempio: Scavo di fondazione zona B]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "3. OSSERVAZIONI SULLA SICUREZZA", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "In relazione alle lavorazioni osservate, si rileva quanto segue:", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Apprestamenti:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Esempio: Le recinzioni di cantiere risultano integre e correttamente posizionate].", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "DPI:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Esempio: Tutto il personale presente risulta munito di casco, calzature antinfortunistiche e gilet ad alta visibilità].", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalie Riscontrate:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " * ", "type": "text"}, {"text": "Esempio:", "type": "text", "marks": [{"type": "italic"}]}, {"text": " Si osserva la mancanza di protezione terminale (parapetto) su una porzione della piattaforma di carico al piano primo.", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Esempio:", "type": "text", "marks": [{"type": "italic"}]}, {"text": " Presenza di materiale di risulta che ostruisce le vie di esodo interne.", "type": "text"}]}]}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "4. DISPOSIZIONI DEL DIRETTORE DEI LAVORI", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Ai sensi delle responsabilità di alta vigilanza, il sottoscritto DL dispone che l'Impresa provveda immediatamente a:", "type": "text"}]}, {"type": "orderedList", "attrs": {"type": null, "start": 1}, "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Ripristinare i parapetti", "type": "text", "marks": [{"type": "bold"}]}, {"text": " mancanti entro e non oltre le ore del giorno [Data].", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Sgombrare le aree di transito", "type": "text", "marks": [{"type": "bold"}]}, {"text": " dai detriti per garantire il passaggio sicuro dei lavoratori.", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Sospendere temporaneamente", "type": "text", "marks": [{"type": "bold"}]}, {"text": " la specifica lavorazione in quota fino al ripristino delle condizioni di sicurezza (se necessario).", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "5. COMUNICAZIONI AL CSE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "(Opzionale, se sono state riscontrate gravi inadempienze)", "type": "text", "marks": [{"type": "italic"}]}, {"text": " Il presente verbale viene trasmesso al Coordinatore per l’Esecuzione (CSE) per le valutazioni di competenza ai sensi del D.Lgs. 81/08.", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "paragraph", "content": [{"text": "Note aggiuntive:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Spazio per eventuali note dell'impresa]", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Firme per presa visione e accettazione:", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "horizontalRule"}, {"type": "paragraph", "content": [{"text": "Il Direttore dei Lavori", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "horizontalRule"}, {"type": "paragraph", "content": [{"text": "Il Responsabile di Cantiere (Impresa)", "type": "text", "marks": [{"type": "bold"}]}]}]}	{"source": "upload-files-component"}	2026-03-28 23:55:58.95529+00	2026-03-29 00:50:54.511404+00	74	21	2026-03-29
59	Verbale sulla sicurezza 2 giugno	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 1}, "content": [{"text": "2 GIUGNO", "type": "text", "marks": [{"type": "bold"}, {"type": "italic"}, {"type": "underline"}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "VERBALE DI SOPRALLUOGO E COORDINAMENTO SICUREZZA", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome del Cantiere / Indirizzo] ", "type": "text"}, {"text": "Data:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [GG/MM/AAAA] | ", "type": "text"}, {"text": "Ora:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ", "type": "text"}, {"text": "Verbale n°:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Numero progressivo]", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "1. PARTECIPANTI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Direttore Lavori (DL):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome e Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Coord. Sicurezza (CSE):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome e Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Impresa Affidataria:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] - Rappresentante: [Nome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Imprese Esecutrici/Subappalti:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] - Rappresentante: [Nome]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "2. STATO DEI LAVORI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Fase lavorativa in corso:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Es. Scavi, montaggio ponteggi, getto solai]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Aree visionate:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Specificare i piani o le zone del cantiere]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "3. VERIFICHE EFFETTUATE (Checklist rapida)", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Recinzioni e accessi:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Conformi / Non conformi", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "DPI (Caschi, scarpe, imbracature):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Corretto utilizzo / Richiamo effettuato", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Apprestamenti (Ponteggi, parapetti):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Integri / Da revisionare", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Documentazione (POS, tesserini):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Aggiornata / Da integrare", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Impianto elettrico di cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Certificato / Integro", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "4. OSSERVAZIONI E PRESCRIZIONI DEL CSE", "type": "text"}]}, {"type": "blockquote", "content": [{"type": "paragraph", "content": [{"text": "In questa sezione il Coordinatore riporta eventuali anomalie riscontrate e le azioni correttive richieste.", "type": "text"}]}]}, {"type": "orderedList", "attrs": {"type": null, "start": 1}, "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalia:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Descrizione del rischio riscontrato]", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prescrizione:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Cosa fare per risolvere]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Scadenza:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Entro le ore/data]", "type": "text"}]}]}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalia:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Es. Mancanza segnaletica nell'area X]", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prescrizione:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ripristinare cartellonistica]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Scadenza:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Immediata]", "type": "text"}]}]}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "5. DICHIARAZIONI DELLE IMPRESE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "L'impresa [Nome] prende atto delle osservazioni e si impegna a risolverle entro i termini stabiliti. Note aggiuntive: [Eventuali giustificazioni o richieste].", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "6. FIRME PER ACCETTAZIONE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Il Coordinatore (CSE):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________ ", "type": "text"}, {"text": "L'Impresa Affidataria:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________ ", "type": "text"}, {"text": "L'Impresa Esecutrice:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________", "type": "text"}]}]}	{"source": "template", "template_id": 2}	2026-03-29 14:31:35.266626+00	2026-03-29 14:31:59.920099+00	74	21	2026-06-01
60	Verbale sulla sicurezza	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "VERBALE DI SOPRALLUOGO E COORDINAMENTO SICUREZZA", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome del Cantiere / Indirizzo] ", "type": "text"}, {"text": "Data:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [GG/MM/AAAA] | ", "type": "text"}, {"text": "Ora:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ", "type": "text"}, {"text": "Verbale n°:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Numero progressivo]", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "1. PARTECIPANTI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Direttore Lavori (DL):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome e Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Coord. Sicurezza (CSE):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome e Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Impresa Affidataria:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] - Rappresentante: [Nome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Imprese Esecutrici/Subappalti:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] - Rappresentante: [Nome]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "2. STATO DEI LAVORI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Fase lavorativa in corso:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Es. Scavi, montaggio ponteggi, getto solai]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Aree visionate:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Specificare i piani o le zone del cantiere]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "3. VERIFICHE EFFETTUATE (Checklist rapida)", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Recinzioni e accessi:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Conformi / Non conformi", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "DPI (Caschi, scarpe, imbracature):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Corretto utilizzo / Richiamo effettuato", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Apprestamenti (Ponteggi, parapetti):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Integri / Da revisionare", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Documentazione (POS, tesserini):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Aggiornata / Da integrare", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Impianto elettrico di cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Certificato / Integro", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "4. OSSERVAZIONI E PRESCRIZIONI DEL CSE", "type": "text"}]}, {"type": "blockquote", "content": [{"type": "paragraph", "content": [{"text": "In questa sezione il Coordinatore riporta eventuali anomalie riscontrate e le azioni correttive richieste.", "type": "text"}]}]}, {"type": "orderedList", "attrs": {"type": null, "start": 1}, "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalia:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Descrizione del rischio riscontrato]", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prescrizione:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Cosa fare per risolvere]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Scadenza:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Entro le ore/data]", "type": "text"}]}]}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalia:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Es. Mancanza segnaletica nell'area X]", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prescrizione:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ripristinare cartellonistica]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Scadenza:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Immediata]", "type": "text"}]}]}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "5. DICHIARAZIONI DELLE IMPRESE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "L'impresa [Nome] prende atto delle osservazioni e si impegna a risolverle entro i termini stabiliti. Note aggiuntive: [Eventuali giustificazioni o richieste].", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "6. FIRME PER ACCETTAZIONE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Il Coordinatore (CSE):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________ ", "type": "text"}, {"text": "L'Impresa Affidataria:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________ ", "type": "text"}, {"text": "L'Impresa Esecutrice:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________", "type": "text"}]}]}	{"source": "template", "template_id": 2}	2026-03-29 14:49:41.565042+00	2026-03-29 14:49:41.565042+00	74	21	2026-03-29
49	DIamogli un titolo	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "bra wtff!=!=!=!=!=!=!?!?!?!?!?", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 01:02:29.832195+00	2026-03-29 01:03:17.212087+00	74	21	2026-02-25
54	Verbale sulla sicurezza Prima Prova	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "VERBALE DI SOPRALLUOGO E COORDINAMENTO SICUREZZA Prima Prova", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome del Cantiere / Indirizzo] ", "type": "text"}, {"text": "Data:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [GG/MM/AAAA] | ", "type": "text"}, {"text": "Ora:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ", "type": "text"}, {"text": "Verbale n°:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Numero progressivo]", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "1. PARTECIPANTI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Direttore Lavori (DL):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome e Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Coord. Sicurezza (CSE):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome e Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Impresa Affidataria:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] - Rappresentante: [Nome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Imprese Esecutrici/Subappalti:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] - Rappresentante: [Nome]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "2. STATO DEI LAVORI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Fase lavorativa in corso:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Es. Scavi, montaggio ponteggi, getto solai]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Aree visionate:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Specificare i piani o le zone del cantiere]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "3. VERIFICHE EFFETTUATE (Checklist rapida)", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Recinzioni e accessi:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Conformi / Non conformi", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "DPI (Caschi, scarpe, imbracature):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Corretto utilizzo / Richiamo effettuato", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Apprestamenti (Ponteggi, parapetti):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Integri / Da revisionare", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Documentazione (POS, tesserini):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Aggiornata / Da integrare", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Impianto elettrico di cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Certificato / Integro", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "4. OSSERVAZIONI E PRESCRIZIONI DEL CSE", "type": "text"}]}, {"type": "blockquote", "content": [{"type": "paragraph", "content": [{"text": "In questa sezione il Coordinatore riporta eventuali anomalie riscontrate e le azioni correttive richieste.", "type": "text"}]}]}, {"type": "orderedList", "attrs": {"type": null, "start": 1}, "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalia:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Descrizione del rischio riscontrato]", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prescrizione:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Cosa fare per risolvere]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Scadenza:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Entro le ore/data]", "type": "text"}]}]}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalia:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Es. Mancanza segnaletica nell'area X]", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prescrizione:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ripristinare cartellonistica]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Scadenza:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Immediata]", "type": "text"}]}]}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "5. DICHIARAZIONI DELLE IMPRESE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "L'impresa [Nome] prende atto delle osservazioni e si impegna a risolverle entro i termini stabiliti. Note aggiuntive: [Eventuali giustificazioni o richieste].", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "6. FIRME PER ACCETTAZIONE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Il Coordinatore (CSE):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________ ", "type": "text"}, {"text": "L'Impresa Affidataria:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________ ", "type": "text"}, {"text": "L'Impresa Esecutrice:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________", "type": "text"}]}]}	{"source": "template", "template_id": 2}	2026-03-29 14:18:33.951005+00	2026-03-29 14:19:07.994692+00	74	21	2026-03-29
50	Verbale sulla sicurezza - modificato	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "modificato", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "VERBALE DI SOPRALLUOGO E COORDINAMENTO SICUREZZA", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome del Cantiere / Indirizzo] ", "type": "text"}, {"text": "Data:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [GG/MM/AAAA] | ", "type": "text"}, {"text": "Ora:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ", "type": "text"}, {"text": "Verbale n°:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Numero progressivo]", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "1. PARTECIPANTI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Direttore Lavori (DL):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome e Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Coord. Sicurezza (CSE):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome e Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Impresa Affidataria:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] - Rappresentante: [Nome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Imprese Esecutrici/Subappalti:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] - Rappresentante: [Nome]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "2. STATO DEI LAVORI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Fase lavorativa in corso:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Es. Scavi, montaggio ponteggi, getto solai]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Aree visionate:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Specificare i piani o le zone del cantiere]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "3. VERIFICHE EFFETTUATE (Checklist rapida)", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Recinzioni e accessi:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Conformi / Non conformi", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "DPI (Caschi, scarpe, imbracature):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Corretto utilizzo / Richiamo effettuato", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Apprestamenti (Ponteggi, parapetti):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Integri / Da revisionare", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Documentazione (POS, tesserini):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Aggiornata / Da integrare", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Impianto elettrico di cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Certificato / Integro", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "4. OSSERVAZIONI E PRESCRIZIONI DEL CSE", "type": "text"}]}, {"type": "blockquote", "content": [{"type": "paragraph", "content": [{"text": "In questa sezione il Coordinatore riporta eventuali anomalie riscontrate e le azioni correttive richieste.", "type": "text"}]}]}, {"type": "orderedList", "attrs": {"type": null, "start": 1}, "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalia:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Descrizione del rischio riscontrato]", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prescrizione:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Cosa fare per risolvere]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Scadenza:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Entro le ore/data]", "type": "text"}]}]}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalia:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Es. Mancanza segnaletica nell'area X]", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prescrizione:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ripristinare cartellonistica]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Scadenza:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Immediata]", "type": "text"}]}]}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "5. DICHIARAZIONI DELLE IMPRESE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "L'impresa [Nome] prende atto delle osservazioni e si impegna a risolverle entro i termini stabiliti. Note aggiuntive: [Eventuali giustificazioni o richieste].", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "6. FIRME PER ACCETTAZIONE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Il Coordinatore (CSE):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________ ", "type": "text"}, {"text": "L'Impresa Affidataria:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________ ", "type": "text"}, {"text": "L'Impresa Esecutrice:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________", "type": "text"}]}]}	{"source": "template", "template_id": 1}	2026-03-29 14:15:41.338111+00	2026-03-29 14:16:00.639907+00	74	21	2026-03-29
55	Verbale sulla sicurezza 2 aprile 2026	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "VERBALE DI SOPRALLUOGO E COORDINAMENTO SICUREZZA", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome del Cantiere / Indirizzo] ", "type": "text"}, {"text": "Data:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [GG/MM/AAAA] | ", "type": "text"}, {"text": "Ora:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ", "type": "text"}, {"text": "Verbale n°:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Numero progressivo]", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "1. PARTECIPANTI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Direttore Lavori (DL):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome e Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Coord. Sicurezza (CSE):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome e Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Impresa Affidataria:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] - Rappresentante: [Nome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Imprese Esecutrici/Subappalti:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] - Rappresentante: [Nome]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "2. STATO DEI LAVORI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Fase lavorativa in corso:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Es. Scavi, montaggio ponteggi, getto solai]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Aree visionate:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Specificare i piani o le zone del cantiere]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "3. VERIFICHE EFFETTUATE (Checklist rapida)", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Recinzioni e accessi:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Conformi / Non conformi", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "DPI (Caschi, scarpe, imbracature):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Corretto utilizzo / Richiamo effettuato", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Apprestamenti (Ponteggi, parapetti):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Integri / Da revisionare", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Documentazione (POS, tesserini):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Aggiornata / Da integrare", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Impianto elettrico di cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Certificato / Integro", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "4. OSSERVAZIONI E PRESCRIZIONI DEL CSE", "type": "text"}]}, {"type": "blockquote", "content": [{"type": "paragraph", "content": [{"text": "In questa sezione il Coordinatore riporta eventuali anomalie riscontrate e le azioni correttive richieste.", "type": "text"}]}]}, {"type": "orderedList", "attrs": {"type": null, "start": 1}, "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalia:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Descrizione del rischio riscontrato]", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prescrizione:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Cosa fare per risolvere]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Scadenza:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Entro le ore/data]", "type": "text"}]}]}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalia:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Es. Mancanza segnaletica nell'area X]", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prescrizione:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ripristinare cartellonistica]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Scadenza:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Immediata]", "type": "text"}]}]}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "5. DICHIARAZIONI DELLE IMPRESE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "L'impresa [Nome] prende atto delle osservazioni e si impegna a risolverle entro i termini stabiliti. Note aggiuntive: [Eventuali giustificazioni o richieste].", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "6. FIRME PER ACCETTAZIONE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Il Coordinatore (CSE):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________ ", "type": "text"}, {"text": "L'Impresa Affidataria:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________ ", "type": "text"}, {"text": "L'Impresa Esecutrice:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________", "type": "text"}]}]}	{"source": "template", "template_id": 2}	2026-03-29 14:22:39.739205+00	2026-03-29 14:22:49.491976+00	74	21	2026-04-02
65	5 giugno davvero	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "5 giugno davvero", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 15:08:32.104246+00	2026-03-29 15:08:42.815797+00	74	21	2026-05-05
61	Verbale sulla sicurezza 3 giugno	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "3 giugno", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "VERBALE DI SOPRALLUOGO E COORDINAMENTO SICUREZZA", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome del Cantiere / Indirizzo] ", "type": "text"}, {"text": "Data:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [GG/MM/AAAA] | ", "type": "text"}, {"text": "Ora:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ", "type": "text"}, {"text": "Verbale n°:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Numero progressivo]", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "1. PARTECIPANTI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Direttore Lavori (DL):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome e Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Coord. Sicurezza (CSE):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome e Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Impresa Affidataria:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] - Rappresentante: [Nome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Imprese Esecutrici/Subappalti:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] - Rappresentante: [Nome]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "2. STATO DEI LAVORI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Fase lavorativa in corso:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Es. Scavi, montaggio ponteggi, getto solai]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Aree visionate:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Specificare i piani o le zone del cantiere]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "3. VERIFICHE EFFETTUATE (Checklist rapida)", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Recinzioni e accessi:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Conformi / Non conformi", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "DPI (Caschi, scarpe, imbracature):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Corretto utilizzo / Richiamo effettuato", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Apprestamenti (Ponteggi, parapetti):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Integri / Da revisionare", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Documentazione (POS, tesserini):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Aggiornata / Da integrare", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Impianto elettrico di cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Certificato / Integro", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "4. OSSERVAZIONI E PRESCRIZIONI DEL CSE", "type": "text"}]}, {"type": "blockquote", "content": [{"type": "paragraph", "content": [{"text": "In questa sezione il Coordinatore riporta eventuali anomalie riscontrate e le azioni correttive richieste.", "type": "text"}]}]}, {"type": "orderedList", "attrs": {"type": null, "start": 1}, "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalia:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Descrizione del rischio riscontrato]", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prescrizione:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Cosa fare per risolvere]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Scadenza:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Entro le ore/data]", "type": "text"}]}]}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalia:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Es. Mancanza segnaletica nell'area X]", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prescrizione:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ripristinare cartellonistica]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Scadenza:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Immediata]", "type": "text"}]}]}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "5. DICHIARAZIONI DELLE IMPRESE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "L'impresa [Nome] prende atto delle osservazioni e si impegna a risolverle entro i termini stabiliti. Note aggiuntive: [Eventuali giustificazioni o richieste].", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "6. FIRME PER ACCETTAZIONE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Il Coordinatore (CSE):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________ ", "type": "text"}, {"text": "L'Impresa Affidataria:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________ ", "type": "text"}, {"text": "L'Impresa Esecutrice:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________", "type": "text"}]}]}	{"source": "template", "template_id": 2}	2026-03-29 14:50:01.881974+00	2026-03-29 14:50:12.863185+00	74	21	2026-06-02
56	documento vuoto del 16 aprile	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "del 16 aprile", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 14:23:20.161567+00	2026-03-29 14:23:38.249905+00	74	21	2026-04-16
57	Progetto senza titolo	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Nuovo documento", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 14:25:25.283046+00	2026-03-29 14:25:27.655842+00	74	21	2026-03-29
62	Verbale sulla sicurezza	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "VERBALE DI SOPRALLUOGO E COORDINAMENTO SICUREZZA", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome del Cantiere / Indirizzo] ", "type": "text"}, {"text": "Data:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [GG/MM/AAAA] | ", "type": "text"}, {"text": "Ora:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ", "type": "text"}, {"text": "Verbale n°:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Numero progressivo]", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "1. PARTECIPANTI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Direttore Lavori (DL):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome e Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Coord. Sicurezza (CSE):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome e Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Impresa Affidataria:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] - Rappresentante: [Nome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Imprese Esecutrici/Subappalti:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] - Rappresentante: [Nome]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "2. STATO DEI LAVORI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Fase lavorativa in corso:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Es. Scavi, montaggio ponteggi, getto solai]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Aree visionate:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Specificare i piani o le zone del cantiere]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "3. VERIFICHE EFFETTUATE (Checklist rapida)", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Recinzioni e accessi:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Conformi / Non conformi", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "DPI (Caschi, scarpe, imbracature):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Corretto utilizzo / Richiamo effettuato", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Apprestamenti (Ponteggi, parapetti):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Integri / Da revisionare", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Documentazione (POS, tesserini):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Aggiornata / Da integrare", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Impianto elettrico di cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Certificato / Integro", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "4. OSSERVAZIONI E PRESCRIZIONI DEL CSE", "type": "text"}]}, {"type": "blockquote", "content": [{"type": "paragraph", "content": [{"text": "In questa sezione il Coordinatore riporta eventuali anomalie riscontrate e le azioni correttive richieste.", "type": "text"}]}]}, {"type": "orderedList", "attrs": {"type": null, "start": 1}, "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalia:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Descrizione del rischio riscontrato]", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prescrizione:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Cosa fare per risolvere]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Scadenza:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Entro le ore/data]", "type": "text"}]}]}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalia:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Es. Mancanza segnaletica nell'area X]", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prescrizione:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ripristinare cartellonistica]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Scadenza:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Immediata]", "type": "text"}]}]}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "5. DICHIARAZIONI DELLE IMPRESE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "L'impresa [Nome] prende atto delle osservazioni e si impegna a risolverle entro i termini stabiliti. Note aggiuntive: [Eventuali giustificazioni o richieste].", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "6. FIRME PER ACCETTAZIONE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Il Coordinatore (CSE):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________ ", "type": "text"}, {"text": "L'Impresa Affidataria:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________ ", "type": "text"}, {"text": "L'Impresa Esecutrice:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________", "type": "text"}]}]}	{"source": "template", "template_id": 2}	2026-03-29 14:52:59.773435+00	2026-03-29 14:54:11.617753+00	74	21	2026-04-10
58	Verbale sulla sicurezza 1 giugno	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "VERBALE DI SOPRALLUOGO E COORDINAMENTO SICUREZZA", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome del Cantiere / Indirizzo] ", "type": "text"}, {"text": "Data:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [GG/MM/AAAA] | ", "type": "text"}, {"text": "Ora:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ", "type": "text"}, {"text": "Verbale n°:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Numero progressivo]", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "1. PARTECIPANTI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Direttore Lavori (DL):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome e Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Coord. Sicurezza (CSE):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome e Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Impresa Affidataria:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] - Rappresentante: [Nome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Imprese Esecutrici/Subappalti:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] - Rappresentante: [Nome]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "2. STATO DEI LAVORI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Fase lavorativa in corso:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Es. Scavi, montaggio ponteggi, getto solai]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Aree visionate:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Specificare i piani o le zone del cantiere]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "3. VERIFICHE EFFETTUATE (Checklist rapida)", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Recinzioni e accessi:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Conformi / Non conformi", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "DPI (Caschi, scarpe, imbracature):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Corretto utilizzo / Richiamo effettuato", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Apprestamenti (Ponteggi, parapetti):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Integri / Da revisionare", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Documentazione (POS, tesserini):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Aggiornata / Da integrare", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Impianto elettrico di cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Certificato / Integro", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "4. OSSERVAZIONI E PRESCRIZIONI DEL CSE", "type": "text"}]}, {"type": "blockquote", "content": [{"type": "paragraph", "content": [{"text": "In questa sezione il Coordinatore riporta eventuali anomalie riscontrate e le azioni correttive richieste.", "type": "text"}]}]}, {"type": "orderedList", "attrs": {"type": null, "start": 1}, "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalia:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Descrizione del rischio riscontrato]", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prescrizione:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Cosa fare per risolvere]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Scadenza:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Entro le ore/data]", "type": "text"}]}]}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalia:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Es. Mancanza segnaletica nell'area X]", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prescrizione:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ripristinare cartellonistica]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Scadenza:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Immediata]", "type": "text"}]}]}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "5. DICHIARAZIONI DELLE IMPRESE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "L'impresa [Nome] prende atto delle osservazioni e si impegna a risolverle entro i termini stabiliti. Note aggiuntive: [Eventuali giustificazioni o richieste].", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "6. FIRME PER ACCETTAZIONE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Il Coordinatore (CSE):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________ ", "type": "text"}, {"text": "L'Impresa Affidataria:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________ ", "type": "text"}, {"text": "L'Impresa Esecutrice:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________", "type": "text"}]}]}	{"source": "template", "template_id": 2}	2026-03-29 14:25:39.400107+00	2026-03-29 14:25:48.269195+00	74	21	2026-06-01
63	Progetto senza titolo	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Nuovo documento", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 14:54:25.964667+00	2026-03-29 14:59:50.40185+00	74	21	2026-06-03
68	2626-06-09	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Nuovo documento", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 15:38:11.113669+00	2026-03-29 15:38:23.571526+00	74	21	2026-06-08
64	Progetto senza titolo 5 giugno	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Nuovo documento 5 giugno", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 15:07:48.381651+00	2026-03-29 15:07:59.078842+00	74	21	2026-05-05
66	7 giugno	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "7 giugno", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 15:18:20.105323+00	2026-03-29 15:18:28.946231+00	74	21	2026-06-06
67	8 giugno 2026 - new	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Nuovo documento", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 15:36:45.81167+00	2026-03-29 15:37:00.622005+00	74	21	2026-06-07
69	10 GIUGNO 2026	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Nuovo documento", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 15:41:36.261431+00	2026-03-29 15:41:48.321442+00	74	21	2026-06-09
70	11 giugno 2026	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "11 giugno 2026", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 16:21:56.530934+00	2026-03-29 16:22:17.013264+00	74	21	2026-06-10
71	12 giugno	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Nuovo documento", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 16:30:57.647934+00	2026-03-29 16:31:35.221465+00	74	21	2026-06-11
47	BOD	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "ELLAAA!!!", "type": "text"}]}, {"type": "paragraph"}]}	{"source": "upload-files-component"}	2026-03-29 00:00:16.347865+00	2026-03-29 00:04:06.643896+00	74	21	2026-04-09
72	13 giugno	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Nuovo documento", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 16:31:49.177391+00	2026-03-29 16:36:18.161335+00	74	21	2026-06-12
73	14 giugno	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Nuovo documento", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 16:36:29.587962+00	2026-03-29 16:38:31.085693+00	74	21	2026-06-13
75	Progetto senza titolo	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Nuovo documento", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 16:53:24.142077+00	2026-03-29 16:53:24.142077+00	74	21	2026-03-29
74	15 giugno	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Nuovo documento", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 16:44:11.90789+00	2026-03-29 16:44:18.299814+00	74	21	2026-06-14
76	16 giugno	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Nuovo documento", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 16:53:39.815183+00	2026-03-29 17:04:56.25319+00	74	21	2026-06-15
77	17 giugno	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Nuovo documento", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 17:08:04.01573+00	2026-03-29 17:08:13.94631+00	74	21	2026-06-15
78	Progetto senza titolo	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Nuovo documento", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 17:45:34.30957+00	2026-03-29 17:45:34.30957+00	74	21	2026-03-29
79	18 giugno	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Nuovo documento", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 17:45:47.39527+00	2026-03-29 17:45:54.602929+00	74	21	2026-06-17
80	19 giugno	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Nuovo documento", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 18:12:32.543008+00	2026-03-29 18:12:39.529716+00	74	21	2026-06-18
81	20 giugno	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Nuovo documento", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 18:13:44.126576+00	2026-03-29 18:13:49.988609+00	74	21	2026-06-19
82	21 giugno	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Nuovo documento", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-29 18:24:18.548688+00	2026-03-29 18:24:25.31658+00	74	21	2026-06-21
83	Progetto senza titolo	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Nuovo documento", "type": "text"}]}]}	{"source": "upload-files-component"}	2026-03-31 22:59:17.862652+00	2026-03-31 22:59:17.862652+00	74	21	2026-04-01
84	template di prova	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Io sottoscritto ________ autorizzo _________ a lavorare in questo cantiere", "type": "text"}]}]}	{"source": "template", "template_id": 3}	2026-03-31 23:03:19.885165+00	2026-03-31 23:03:22.28261+00	74	21	2026-04-01
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.teams (id, name) FROM stdin;
1	Squadra Specializzata
2	Squadra Specializzata
\.


--
-- Data for Name: templates; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.templates (id, name, content_json, created_at, updated_at, owner_id) FROM stdin;
2	Verbale sulla sicurezza	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "VERBALE DI SOPRALLUOGO E COORDINAMENTO SICUREZZA", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome del Cantiere / Indirizzo] ", "type": "text"}, {"text": "Data:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [GG/MM/AAAA] | ", "type": "text"}, {"text": "Ora:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ", "type": "text"}, {"text": "Verbale n°:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Numero progressivo]", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "1. PARTECIPANTI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Direttore Lavori (DL):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome e Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Coord. Sicurezza (CSE):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Nome e Cognome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Impresa Affidataria:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] - Rappresentante: [Nome]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Imprese Esecutrici/Subappalti:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ragione Sociale] - Rappresentante: [Nome]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "2. STATO DEI LAVORI", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Fase lavorativa in corso:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Es. Scavi, montaggio ponteggi, getto solai]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Aree visionate:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Specificare i piani o le zone del cantiere]", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "3. VERIFICHE EFFETTUATE (Checklist rapida)", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Recinzioni e accessi:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Conformi / Non conformi", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "DPI (Caschi, scarpe, imbracature):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Corretto utilizzo / Richiamo effettuato", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Apprestamenti (Ponteggi, parapetti):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Integri / Da revisionare", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Documentazione (POS, tesserini):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Aggiornata / Da integrare", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "[ ] ", "type": "text"}, {"text": "Impianto elettrico di cantiere:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " Certificato / Integro", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "4. OSSERVAZIONI E PRESCRIZIONI DEL CSE", "type": "text"}]}, {"type": "blockquote", "content": [{"type": "paragraph", "content": [{"text": "In questa sezione il Coordinatore riporta eventuali anomalie riscontrate e le azioni correttive richieste.", "type": "text"}]}]}, {"type": "orderedList", "attrs": {"type": null, "start": 1}, "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalia:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Descrizione del rischio riscontrato]", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prescrizione:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Cosa fare per risolvere]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Scadenza:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Entro le ore/data]", "type": "text"}]}]}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Anomalia:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Es. Mancanza segnaletica nell'area X]", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prescrizione:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Ripristinare cartellonistica]", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Scadenza:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " [Immediata]", "type": "text"}]}]}]}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "5. DICHIARAZIONI DELLE IMPRESE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "L'impresa [Nome] prende atto delle osservazioni e si impegna a risolverle entro i termini stabiliti. Note aggiuntive: [Eventuali giustificazioni o richieste].", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "6. FIRME PER ACCETTAZIONE", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Il Coordinatore (CSE):", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________ ", "type": "text"}, {"text": "L'Impresa Affidataria:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________ ", "type": "text"}, {"text": "L'Impresa Esecutrice:", "type": "text", "marks": [{"type": "bold"}]}, {"text": " ___________________________", "type": "text"}]}]}	2026-03-29 14:17:53.260195+00	2026-03-29 14:17:57.700292+00	74
3	template di prova	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Io sottoscritto ________ autorizzo _________ a lavorare in questo cantiere", "type": "text"}]}]}	2026-03-31 23:00:09.356878+00	2026-03-31 23:02:00.625346+00	74
4	kjklm	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "", "type": "text"}]}]}	2026-03-31 23:04:58.501798+00	2026-03-31 23:04:58.501798+00	74
5	klas	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "", "type": "text"}]}]}	2026-03-31 23:06:31.332241+00	2026-03-31 23:06:31.332241+00	74
\.


--
-- Data for Name: user_type; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_type (id, name, owner_id) FROM stdin;
1	admin	\N
2	ispettore di cantiere	\N
3	Guardatore	3
4	Imbianchino	3
5	Maresciallo CC	3
6	Panettiere	3
7	Pasticcere	3
8	Operaio Specializzato	11
9	Operaio Specializzato	18
10	Idraulico	25
11	Imbianchino	25
12	Muratore	25
13	Manovale	25
14	Gessista	25
15	Architetto	25
16	Responsabile Sicurezza	25
17	Idraulico	32
18	Imbianchino	32
19	Muratore	32
20	Manovale	32
21	Gessista	32
22	Architetto	32
23	Responsabile Sicurezza	32
24	Idraulico	39
25	Imbianchino	39
26	Muratore	39
27	Manovale	39
28	Gessista	39
29	Architetto	39
30	Responsabile Sicurezza	39
31	Idraulico	46
32	Imbianchino	46
33	Muratore	46
34	Manovale	46
35	Gessista	46
36	Architetto	46
37	Responsabile Sicurezza	46
38	Idraulico	53
39	Imbianchino	53
40	Muratore	53
41	Manovale	53
42	Gessista	53
43	Architetto	53
44	Responsabile Sicurezza	53
45	Idraulico	60
46	Imbianchino	60
47	Muratore	60
48	Manovale	60
49	Gessista	60
50	Architetto	60
51	Responsabile Sicurezza	60
52	Idraulico	67
53	Imbianchino	67
54	Muratore	67
55	Manovale	67
56	Gessista	67
57	Architetto	67
58	Responsabile Sicurezza	67
59	Idraulico	74
60	Imbianchino	74
61	Muratore	74
62	Manovale	74
63	Gessista	74
64	Architetto	74
65	Responsabile Sicurezza	74
66	Idraulico	81
67	Imbianchino	81
68	Muratore	81
69	Manovale	81
70	Gessista	81
71	Architetto	81
72	Responsabile Sicurezza	81
73	Idraulico	88
74	Imbianchino	88
75	Muratore	88
76	Manovale	88
77	Gessista	88
78	Architetto	88
79	Responsabile Sicurezza	88
80	Idraulico	95
81	Imbianchino	95
82	Muratore	95
83	Manovale	95
84	Gessista	95
85	Architetto	95
86	Responsabile Sicurezza	95
87	Idraulico	102
88	Imbianchino	102
89	Muratore	102
90	Manovale	102
91	Gessista	102
92	Architetto	102
93	Responsabile Sicurezza	102
101	Idraulico	116
102	Imbianchino	116
103	Muratore	116
104	Manovale	116
105	Gessista	116
106	Architetto	116
107	Responsabile Sicurezza	116
108	Idraulico	123
109	Imbianchino	123
110	Muratore	123
111	Manovale	123
112	Gessista	123
113	Architetto	123
114	Responsabile Sicurezza	123
115	Idraulico	130
116	Imbianchino	130
117	Muratore	130
118	Manovale	130
119	Gessista	130
120	Architetto	130
121	Responsabile Sicurezza	130
122	Idraulico	137
123	Imbianchino	137
124	Muratore	137
125	Manovale	137
126	Gessista	137
127	Architetto	137
128	Responsabile Sicurezza	137
129	Idraulico	144
130	Imbianchino	144
131	Muratore	144
132	Manovale	144
133	Gessista	144
134	Architetto	144
135	Responsabile Sicurezza	144
136	Idraulico	145
137	Imbianchino	145
138	Muratore	145
139	Manovale	145
140	Gessista	145
141	Architetto	145
142	Responsabile Sicurezza	145
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, first_name, last_name, username, email, password, phone, notes, owner_id, refresh_token) FROM stdin;
1	admin	admin	\N	\N	\N	\N	\N	1	\N
2	ciao	ciao	ciao	ciao@gmail.com	$2b$10$VUebwoBTjvIetTMO/X5rTePtly7Xk4tDzzb5ZBwgtzqasC/2hwvUW	123456789	\N	1	\N
3	Gastone			gastone@gmail.com	$2b$10$T2lyncnQkyiSfkuXuy3GuO8XiTU4G9hCdvqq7hF2MQKeOWM1cmDt2		\N	1	\N
6	Alessio	Butticè	\N	\N	\N	\N	\N	3	\N
5	Stefano	Buttcè	\N	stefano@gmail.com	\N	684648465468	\N	3	\N
7	Samuele	Randisi	\N	\N	\N	\N	\N	3	\N
4	Gabriele	Butticè	\N	gabriele@gmail.com	\N	584138541	\N	3	\N
8	Gerlando	Cugino	\N	\N	\N	\N	\N	3	\N
10	gabriele			gabriele@gmail.com	$2b$10$GDFR0.645XRI/JL44FtnI.SDicCfIV.KD7HVXoIYj.7I5RmBHwMeW		\N	1	\N
11	1			1@gmail.com	$2b$10$kldEMZ4EixYGzQbqAXkjq.pMGMJvZkW4fYCY1bqtnPpvBYLd7ug0y		\N	1	\N
12	Giustino	La Rocca	\N	giustinolarocca@example.com	\N	3665478951	Visita medica, UNILAV, DPI	11	\N
13	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere - POS, DURC	11	\N
14	Vasile Marian	Cristian	\N	\N	\N	\N	Manovale - Visita medica	11	\N
15	Barrera	Mirko	\N	\N	\N	\N	Manovale - UNILAV	11	\N
16	Cuffaro	Giuseppe	\N	\N	\N	\N	DPI consegnati	11	\N
17	Esposito	Gennaro	\N	\N	\N	\N	Gruista	11	\N
18	2			2@gmail.com	$2b$10$tOzZQBA0W8z4PIH5cs243.7COPkYMhmsRyA1QT142hHMFXMAE1adm		\N	1	\N
19	Giustino	La Rocca	\N	giustinolarocca@example.com	\N	3665478951	Visita medica, UNILAV, DPI	18	\N
20	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere - POS, DURC	18	\N
21	Vasile Marian	Cristian	\N	\N	\N	\N	Manovale - Visita medica	18	\N
22	Barrera	Mirko	\N	\N	\N	\N	Manovale - UNILAV	18	\N
23	Cuffaro	Giuseppe	\N	\N	\N	\N	DPI consegnati	18	\N
24	Esposito	Gennaro	\N	\N	\N	\N	Gruista	18	\N
25	3@gmail.com			3@gmail.com	$2b$10$VNPIJ/qjMVwtjB.gcfke5.efYsusO3vi2yT5AZOhErOJYFYxqf/3W		\N	1	\N
26	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	25	\N
27	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	25	\N
28	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	25	\N
29	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	25	\N
30	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	25	\N
31	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	25	\N
32	5@gmail.com			5@gmail.com	$2b$10$xFDfTo7VwdQr6JLWa8VKOuU3Y1uCyTpCWYTx6MEW3geNZ2iyVYyhW		\N	1	\N
33	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	32	\N
34	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	32	\N
35	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	32	\N
36	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	32	\N
37	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	32	\N
38	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	32	\N
39	a			a@gmail.com	$2b$10$3Wuhgc.6fI/Fjpm0H0z8N.iM8aliIo60fXx7DtlrvYVaHeOoW2afC		\N	1	\N
40	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	39	\N
41	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	39	\N
42	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	39	\N
43	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	39	\N
44	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	39	\N
45	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	39	\N
46	yo@gmail.com			yo@gmail.com	$2b$10$DqWF2EDEYn.javDTEobJdu6xB0JKbfoCeywBecpmjWrprhkeiWpOq		\N	1	\N
47	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	46	\N
48	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	46	\N
49	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	46	\N
50	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	46	\N
51	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	46	\N
52	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	46	\N
53	ei			ei@gmail.com	$2b$10$NOulP2PoxRFRR1M/0c/WiORfwitaTyf/eRNNan2gwpOqW52YwxdDm		\N	1	\N
54	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	53	\N
55	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	53	\N
56	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	53	\N
57	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	53	\N
58	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	53	\N
59	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	53	\N
60	halo			halo@gmail.com	$2b$10$fHG05fwQwvV.WjSYbbtLDeG4YGBxcvvFAF02J.NjU33vJk0FuhDp2		\N	1	\N
61	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	60	\N
62	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	60	\N
63	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	60	\N
64	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	60	\N
65	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	60	\N
66	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	60	\N
67	hola@gmail.com			hola@gmail.com	$2b$10$qrCP2nDR/ZW/8sxxz9JQFuQiz8sp.o2S3Kb9QThCc7LpIZk8gI2gy		\N	1	\N
68	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	67	\N
69	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	67	\N
70	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	67	\N
71	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	67	\N
72	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	67	\N
73	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	67	\N
75	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	74	\N
76	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	74	\N
77	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	74	\N
78	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	74	\N
79	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	74	\N
80	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	74	\N
81	ispettore1			ispettore1@gmail.com	$2b$10$0MtY8/gIyktzejz24vXxJ.mgt.J9e49c0JIZGU0CyGroRcibJoTnK		\N	1	\N
82	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	81	\N
83	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	81	\N
84	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	81	\N
85	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	81	\N
86	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	81	\N
87	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	81	\N
88	prova			prova@example.com	$2b$10$DQ.nXNi1w18BR/Htx5lc6.t5Z4jBO1X3epmZGvttDobA6DTESGive		\N	1	\N
89	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	88	\N
90	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	88	\N
91	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	88	\N
92	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	88	\N
93	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	88	\N
94	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	88	\N
95	prova1			prova1@example.com	$2b$10$e7Jca7f4O9.BZbbB5Xvf8.mAZPCuYQz82JEslRCg9TZB.rF2hhxSq		\N	1	\N
96	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	95	\N
97	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	95	\N
98	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	95	\N
99	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	95	\N
100	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	95	\N
101	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	95	\N
102	prova2			prova2@example.com	$2b$10$nzEDdNZeh2sreB2M0Aov/OxZt2o1wUBqWb93z9clFF/YbKtQ4M9Ie		\N	1	\N
103	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	102	\N
104	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	102	\N
105	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	102	\N
106	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	102	\N
107	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	102	\N
108	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	102	\N
116	prova1@example.com			prova3@example.com	$2b$10$kcL3o8wEPBYoU1dh9qM2muPvyUpny58jtTF6kI0EZtWx/PB2Tq7tm		\N	1	\N
117	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	116	\N
118	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	116	\N
119	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	116	\N
120	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	116	\N
121	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	116	\N
122	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	116	\N
123	prova4			prova4@example.com	$2b$10$JlUMG6m/HYArvYHgc4CktubpI9vAtBmzYvH.FdscWYq8qSALdYTsO		\N	1	\N
124	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	123	\N
125	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	123	\N
126	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	123	\N
127	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	123	\N
128	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	123	\N
129	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	123	\N
130	prova5@example.com			prova5@example.com	$2b$10$vFig.SfvGTaVZ97Vv.wsxuQcqPTsnzlCMQLvkKwHoZLUaWDBngNA2		\N	1	\N
131	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	130	\N
132	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	130	\N
133	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	130	\N
134	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	130	\N
135	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	130	\N
136	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	130	\N
138	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	137	\N
139	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	137	\N
140	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	137	\N
141	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	137	\N
143	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	137	\N
137	prova6			prova6@example.com	$2b$10$CgIBeFWjPKHU.2FsOrkLmeoVXTF.KYUK5TY1dXhxVvI31ExKMPS6W		\N	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTM3LCJpYXQiOjE3NzQ5ODk5MTYsImV4cCI6MTc3NTU5NDcxNn0.gEyTAQg5IhXJZw75CAFH-dFmkMb6WTjjGwAYKmtogJ8
142	Cuffaro	Alberto	\N		\N		Direzione lavori	137	\N
74	authorized1			authorized1@gmail.com	$2b$10$hbwaqmmILw.mes/UhYYmEOutpGdTmY2MGWAILcCcFD/b9NqPOMJ1e		\N	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzQsImlhdCI6MTc3NDk5Nzc2MywiZXhwIjoxNzc3NTg5NzYzfQ.9pfa2vzJcsmnytiUSvnj7VXPX_W5VH6R_MaGAb29lmE
146	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	144	\N
147	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	145	\N
148	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	145	\N
149	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	144	\N
150	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	145	\N
151	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	144	\N
152	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	145	\N
153	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	144	\N
154	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	145	\N
155	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	144	\N
156	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	145	\N
157	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	144	\N
145	prova7			prova7@example.com	$2b$10$PiffQ09Ni/H93sQpmcOhauqO8QZ7Qlp0Mbbc1KdPLZZZvbJ9dIpt6		\N	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQ1LCJpYXQiOjE3NzUwNjc3MzcsImV4cCI6MTc3NzY1OTczN30.ZnYV8iy7Mjn2z5djFInJf1OB_f3zi5uEOhpu2PKzeR0
144	prova7			prova7@example.com	$2b$10$p88xXzmaFNAro/nnwfIU0OSdd5nEKIQzBhGCFdYbSkXgLieCsUFni		\N	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQ0LCJpYXQiOjE3NzUwNjc3MzcsImV4cCI6MTc3NzY1OTczN30.03ImweoiUHENTphsicA7l_qr91T35sN7fsFedl2MlnE
\.


--
-- Data for Name: users_building_sites; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users_building_sites (id, user_id, site_id) FROM stdin;
1	4	1
2	5	1
3	6	1
4	7	1
8	8	1
9	12	2
10	13	2
11	14	2
12	15	2
13	16	2
14	17	2
15	19	3
16	20	3
17	21	3
18	22	3
19	23	3
20	24	3
21	26	4
22	27	4
23	28	4
24	29	4
25	30	4
26	31	4
27	33	5
28	34	5
29	35	5
30	36	5
31	37	5
32	38	5
33	40	6
34	41	6
35	42	6
36	43	6
37	44	6
38	45	6
39	47	7
40	48	7
41	49	7
42	50	7
43	51	7
44	52	7
45	54	8
46	55	8
47	56	8
48	57	8
49	58	8
50	59	8
51	61	11
52	62	11
53	63	11
54	64	11
55	65	11
56	66	11
57	68	12
58	69	12
59	70	12
60	71	12
61	72	12
62	73	12
63	75	21
64	76	21
65	77	21
66	78	21
67	79	21
68	80	21
69	82	22
70	83	22
71	84	22
72	85	22
73	86	22
74	87	22
75	89	23
76	90	23
77	91	23
78	92	23
79	93	23
80	94	23
81	96	24
82	97	24
83	98	24
84	99	24
85	100	24
86	101	24
87	103	25
88	104	25
89	105	25
90	106	25
91	107	25
92	108	25
99	117	27
100	118	27
101	119	27
102	120	27
103	121	27
104	122	27
105	124	28
106	125	28
107	126	28
108	127	28
109	128	28
110	129	28
111	131	29
112	132	29
113	133	29
114	134	29
115	135	29
116	136	29
118	139	30
119	140	30
120	141	30
121	142	30
122	143	30
130	138	31
131	139	31
132	140	31
133	141	31
134	142	31
135	143	31
136	138	30
138	147	34
137	146	33
139	148	34
140	149	33
141	150	34
142	151	33
143	152	34
144	153	33
145	154	34
146	155	33
147	156	34
148	157	33
\.


--
-- Data for Name: users_companies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users_companies (id, user_id, company_id) FROM stdin;
3	6	1
4	6	2
5	5	3
6	7	4
7	4	1
8	4	2
9	8	5
10	8	3
11	12	9
12	13	9
13	14	9
14	15	9
15	16	9
16	17	9
17	19	12
18	20	13
19	21	14
20	22	15
21	23	12
22	24	13
23	26	16
24	27	17
25	28	18
26	29	19
27	30	16
28	31	17
29	33	20
30	34	21
31	35	22
32	36	23
33	37	20
34	38	21
35	40	24
36	41	25
37	42	26
38	43	27
39	44	24
40	45	25
41	47	28
42	48	29
43	49	30
44	50	31
45	51	28
46	52	29
47	54	32
48	55	33
49	56	34
50	57	35
51	58	32
52	59	33
53	61	36
54	62	37
55	63	38
56	64	39
57	65	36
58	66	37
59	68	40
60	69	41
61	70	42
62	71	43
63	72	40
64	73	41
65	75	44
66	76	45
67	77	46
68	78	47
69	79	44
70	80	45
71	82	48
72	83	49
73	84	50
74	85	51
75	86	48
76	87	49
77	89	52
78	90	53
79	91	54
80	92	55
81	93	52
82	94	53
83	96	56
84	97	57
85	98	58
86	99	59
87	100	56
88	101	57
89	103	60
90	104	61
91	105	62
92	106	63
93	107	60
94	108	61
101	117	68
102	118	69
103	119	70
104	120	71
105	121	68
106	122	69
107	124	72
108	125	73
109	126	74
110	127	75
111	128	72
112	129	73
113	131	76
114	132	77
115	133	78
116	134	79
117	135	76
118	136	77
119	138	80
120	139	81
121	140	82
122	141	83
124	143	81
126	142	84
127	147	89
128	146	85
129	148	90
130	149	86
131	150	91
132	151	87
133	152	92
134	153	88
135	154	89
136	155	85
137	156	90
138	157	86
\.


--
-- Data for Name: users_teams; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users_teams (id, user_id, team_id) FROM stdin;
1	12	1
2	13	1
3	14	1
4	15	1
5	16	1
6	17	1
7	19	2
8	20	2
9	21	2
10	22	2
11	23	2
12	24	2
\.


--
-- Data for Name: users_user_type; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users_user_type (id, user_id, user_type_id) FROM stdin;
1	2	2
2	3	2
5	6	3
6	6	4
7	5	4
8	7	5
9	4	3
10	4	4
11	8	6
12	8	7
14	10	2
15	11	2
16	12	8
17	13	8
18	14	8
19	15	8
20	16	8
21	17	8
22	18	2
23	19	9
24	20	9
25	21	9
26	22	9
27	23	9
28	24	9
29	25	2
30	26	10
31	27	12
32	28	13
33	29	14
34	30	15
35	31	16
36	32	2
37	33	17
38	34	19
39	35	20
40	36	21
41	37	22
42	38	23
43	39	2
44	40	24
45	41	26
46	42	27
47	43	28
48	44	29
49	45	30
50	46	2
51	47	31
52	48	33
53	49	34
54	50	35
55	51	36
56	52	37
57	53	2
58	54	38
59	55	40
60	56	41
61	57	42
62	58	43
63	59	44
64	60	2
65	61	45
66	62	47
67	63	48
68	64	49
69	65	50
70	66	51
71	67	2
72	68	52
73	69	54
74	70	55
75	71	56
76	72	57
77	73	58
78	74	2
79	75	59
80	76	61
81	77	62
82	78	63
83	79	64
84	80	65
85	81	2
86	82	66
87	83	68
88	84	69
89	85	70
90	86	71
91	87	72
92	88	2
93	89	73
94	90	75
95	91	76
96	92	77
97	93	78
98	94	79
99	95	2
100	96	80
101	97	82
102	98	83
103	99	84
104	100	85
105	101	86
106	102	2
107	103	87
108	104	89
109	105	90
110	106	91
111	107	92
112	108	93
120	116	2
121	117	101
122	118	103
123	119	104
124	120	105
125	121	106
126	122	107
127	123	2
128	124	108
129	125	110
130	126	111
131	127	112
132	128	113
133	129	114
134	130	2
135	131	115
136	132	117
137	133	118
138	134	119
139	135	120
140	136	121
141	137	2
142	138	122
143	139	124
144	140	125
145	141	126
147	143	128
149	142	127
150	144	2
151	145	2
152	147	136
153	146	129
154	148	138
155	149	131
156	150	139
157	151	132
158	152	140
159	153	133
160	154	141
161	155	134
162	156	142
163	157	135
\.


--
-- Name: building_sites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.building_sites_id_seq', 34, true);


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.companies_id_seq', 92, true);


--
-- Name: daily_notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.daily_notes_id_seq', 418, true);


--
-- Name: daily_presences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.daily_presences_id_seq', 2473, true);


--
-- Name: documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.documents_id_seq', 1, false);


--
-- Name: files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.files_id_seq', 117, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.projects_id_seq', 84, true);


--
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.teams_id_seq', 2, true);


--
-- Name: templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.templates_id_seq', 5, true);


--
-- Name: user_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_type_id_seq', 142, true);


--
-- Name: users_bulding_sites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_bulding_sites_id_seq', 148, true);


--
-- Name: users_companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_companies_id_seq', 138, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 157, true);


--
-- Name: users_teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_teams_id_seq', 12, true);


--
-- Name: users_user_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_user_type_id_seq', 163, true);


--
-- Name: building_sites building_sites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.building_sites
    ADD CONSTRAINT building_sites_pkey PRIMARY KEY (id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: daily_notes daily_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_notes
    ADD CONSTRAINT daily_notes_pkey PRIMARY KEY (id);


--
-- Name: daily_presences daily_presences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_presences
    ADD CONSTRAINT daily_presences_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: files files_storage_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_storage_key_key UNIQUE (storage_key);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: templates templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT templates_pkey PRIMARY KEY (id);


--
-- Name: daily_notes unique_building_site_date; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_notes
    ADD CONSTRAINT unique_building_site_date UNIQUE (building_site_id, date);


--
-- Name: users_building_sites unique_user_site; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_building_sites
    ADD CONSTRAINT unique_user_site UNIQUE (user_id, site_id);


--
-- Name: user_type user_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_type
    ADD CONSTRAINT user_type_pkey PRIMARY KEY (id);


--
-- Name: users_building_sites users_bulding_sites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_building_sites
    ADD CONSTRAINT users_bulding_sites_pkey PRIMARY KEY (id);


--
-- Name: users_companies users_companies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_companies
    ADD CONSTRAINT users_companies_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_teams users_teams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_teams
    ADD CONSTRAINT users_teams_pkey PRIMARY KEY (id);


--
-- Name: users_user_type users_user_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_user_type
    ADD CONSTRAINT users_user_type_pkey PRIMARY KEY (id);


--
-- Name: daily_notes daily_notes_building_site_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_notes
    ADD CONSTRAINT daily_notes_building_site_id_fkey FOREIGN KEY (building_site_id) REFERENCES public.building_sites(id) ON DELETE CASCADE;


--
-- Name: daily_presences daily_presences_building_site_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_presences
    ADD CONSTRAINT daily_presences_building_site_id_fkey FOREIGN KEY (building_site_id) REFERENCES public.building_sites(id) ON DELETE CASCADE;


--
-- Name: daily_presences daily_presences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_presences
    ADD CONSTRAINT daily_presences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: documents documents_file_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_file_id_fkey FOREIGN KEY (file_id) REFERENCES public.files(id) ON DELETE CASCADE;


--
-- Name: projects fk_building_site_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT fk_building_site_id FOREIGN KEY (building_site_id) REFERENCES public.building_sites(id);


--
-- Name: building_sites fk_building_sites_owner; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.building_sites
    ADD CONSTRAINT fk_building_sites_owner FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: companies fk_companies_owner; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT fk_companies_owner FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: daily_notes fk_daily_notes_owner; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_notes
    ADD CONSTRAINT fk_daily_notes_owner FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: daily_presences fk_daily_presences_owner; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_presences
    ADD CONSTRAINT fk_daily_presences_owner FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: files fk_files_building_site_id_building_sites_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT fk_files_building_site_id_building_sites_id FOREIGN KEY (building_site_id) REFERENCES public.building_sites(id);


--
-- Name: files fk_files_owner_id_users_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT fk_files_owner_id_users_id FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: projects fk_owner_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT fk_owner_id FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: templates fk_owner_id_users; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT fk_owner_id_users FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: files fk_project; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE SET NULL;


--
-- Name: user_type fk_user_type_owner; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_type
    ADD CONSTRAINT fk_user_type_owner FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users fk_users_owner; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_owner FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_building_sites users_bulding_sites_site_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_building_sites
    ADD CONSTRAINT users_bulding_sites_site_id_fkey FOREIGN KEY (site_id) REFERENCES public.building_sites(id) ON DELETE CASCADE;


--
-- Name: users_building_sites users_bulding_sites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_building_sites
    ADD CONSTRAINT users_bulding_sites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_companies users_companies_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_companies
    ADD CONSTRAINT users_companies_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: users_companies users_companies_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_companies
    ADD CONSTRAINT users_companies_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_teams users_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_teams
    ADD CONSTRAINT users_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: users_teams users_teams_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_teams
    ADD CONSTRAINT users_teams_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_user_type users_user_type_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_user_type
    ADD CONSTRAINT users_user_type_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_user_type users_user_type_user_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_user_type
    ADD CONSTRAINT users_user_type_user_type_id_fkey FOREIGN KEY (user_type_id) REFERENCES public.user_type(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict ZUa6Rk533l9SAaq8DxuJh7iIOPtGBjctwOgRVZsb5jzrCKV9mb3hOcoWBenpk9N

