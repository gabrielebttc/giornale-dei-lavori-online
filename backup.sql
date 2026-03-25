--
-- PostgreSQL database dump
--

\restrict dmV32D9CevT7D0xfwxhQ6Pm7lFblGyHmGeqC9eFUrdqMIYUrqUUOXeYsrxCiJur

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

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
-- Name: building_sites; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.building_sites OWNER TO postgres;

--
-- Name: building_sites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.building_sites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.building_sites_id_seq OWNER TO postgres;

--
-- Name: building_sites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.building_sites_id_seq OWNED BY public.building_sites.id;


--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    notes text,
    owner_id integer NOT NULL
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companies_id_seq OWNER TO postgres;

--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- Name: daily_notes; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.daily_notes OWNER TO postgres;

--
-- Name: daily_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.daily_notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.daily_notes_id_seq OWNER TO postgres;

--
-- Name: daily_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.daily_notes_id_seq OWNED BY public.daily_notes.id;


--
-- Name: daily_presences; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.daily_presences OWNER TO postgres;

--
-- Name: daily_presences_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.daily_presences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.daily_presences_id_seq OWNER TO postgres;

--
-- Name: daily_presences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.daily_presences_id_seq OWNED BY public.daily_presences.id;


--
-- Name: documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents (
    id integer NOT NULL,
    file_id integer NOT NULL,
    content_json jsonb
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.documents_id_seq OWNER TO postgres;

--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- Name: files; Type: TABLE; Schema: public; Owner: postgres
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
    is_generated boolean DEFAULT false NOT NULL
);


ALTER TABLE public.files OWNER TO postgres;

--
-- Name: files_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.files_id_seq OWNER TO postgres;

--
-- Name: files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;


--
-- Name: teams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teams (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.teams OWNER TO postgres;

--
-- Name: teams_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teams_id_seq OWNER TO postgres;

--
-- Name: teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teams_id_seq OWNED BY public.teams.id;


--
-- Name: user_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_type (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    owner_id integer
);


ALTER TABLE public.user_type OWNER TO postgres;

--
-- Name: user_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_type_id_seq OWNER TO postgres;

--
-- Name: user_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_type_id_seq OWNED BY public.user_type.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
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
    owner_id integer NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_building_sites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_building_sites (
    id integer NOT NULL,
    user_id integer NOT NULL,
    site_id integer NOT NULL
);


ALTER TABLE public.users_building_sites OWNER TO postgres;

--
-- Name: users_bulding_sites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_bulding_sites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_bulding_sites_id_seq OWNER TO postgres;

--
-- Name: users_bulding_sites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_bulding_sites_id_seq OWNED BY public.users_building_sites.id;


--
-- Name: users_companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_companies (
    id integer NOT NULL,
    user_id integer NOT NULL,
    company_id integer NOT NULL
);


ALTER TABLE public.users_companies OWNER TO postgres;

--
-- Name: users_companies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_companies_id_seq OWNER TO postgres;

--
-- Name: users_companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_companies_id_seq OWNED BY public.users_companies.id;


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_teams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_teams (
    id integer NOT NULL,
    user_id integer NOT NULL,
    team_id integer NOT NULL
);


ALTER TABLE public.users_teams OWNER TO postgres;

--
-- Name: users_teams_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_teams_id_seq OWNER TO postgres;

--
-- Name: users_teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_teams_id_seq OWNED BY public.users_teams.id;


--
-- Name: users_user_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_user_type (
    id integer NOT NULL,
    user_id integer NOT NULL,
    user_type_id integer NOT NULL
);


ALTER TABLE public.users_user_type OWNER TO postgres;

--
-- Name: users_user_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_type_id_seq OWNER TO postgres;

--
-- Name: users_user_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_type_id_seq OWNED BY public.users_user_type.id;


--
-- Name: building_sites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.building_sites ALTER COLUMN id SET DEFAULT nextval('public.building_sites_id_seq'::regclass);


--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: daily_notes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_notes ALTER COLUMN id SET DEFAULT nextval('public.daily_notes_id_seq'::regclass);


--
-- Name: daily_presences id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_presences ALTER COLUMN id SET DEFAULT nextval('public.daily_presences_id_seq'::regclass);


--
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- Name: files id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);


--
-- Name: teams id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);


--
-- Name: user_type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_type ALTER COLUMN id SET DEFAULT nextval('public.user_type_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: users_building_sites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_building_sites ALTER COLUMN id SET DEFAULT nextval('public.users_bulding_sites_id_seq'::regclass);


--
-- Name: users_companies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_companies ALTER COLUMN id SET DEFAULT nextval('public.users_companies_id_seq'::regclass);


--
-- Name: users_teams id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_teams ALTER COLUMN id SET DEFAULT nextval('public.users_teams_id_seq'::regclass);


--
-- Name: users_user_type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_user_type ALTER COLUMN id SET DEFAULT nextval('public.users_user_type_id_seq'::regclass);


--
-- Data for Name: building_sites; Type: TABLE DATA; Schema: public; Owner: postgres
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
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
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
\.


--
-- Data for Name: daily_notes; Type: TABLE DATA; Schema: public; Owner: postgres
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
\.


--
-- Data for Name: daily_presences; Type: TABLE DATA; Schema: public; Owner: postgres
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
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documents (id, file_id, content_json) FROM stdin;
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.files (id, name, tag, file_type, date, building_site_id, owner_id, uploaded_at, storage_key, is_generated) FROM stdin;
94	cartellone.pdf	\N	application/pdf	2026-03-13	12	67	2026-03-13 14:54:45.008269	uploads/358c17e8-f1e5-4151-bdd7-215ae4d157e5-site12.pdf	f
95	header.png	\N	image/png	2026-03-13	12	67	2026-03-13 14:54:45.012992	uploads/60eb45de-fdda-40bd-b1de-7215f48ee5cf-site12.png	f
96	cartellone sistemato.pdf	\N	application/pdf	2026-03-13	12	67	2026-03-13 14:54:45.026692	uploads/a27fb747-e047-40f3-b2fe-4a3a866e6cb2-site12.pdf	f
97	header 1.jpg	\N	image/jpeg	2026-03-13	12	67	2026-03-13 14:54:45.10425	uploads/3893fbd3-055a-4e13-be83-de1769495859-site12.jpg	f
98	insegna petraleuka (corsivo).pdf	\N	application/pdf	2026-03-13	12	67	2026-03-13 14:54:45.233792	uploads/099cd9a1-7f83-451e-9324-0322dc38df66-site12.pdf	f
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teams (id, name) FROM stdin;
1	Squadra Specializzata
2	Squadra Specializzata
\.


--
-- Data for Name: user_type; Type: TABLE DATA; Schema: public; Owner: postgres
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
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, first_name, last_name, username, email, password, phone, notes, owner_id) FROM stdin;
1	admin	admin	\N	\N	\N	\N	\N	1
2	ciao	ciao	ciao	ciao@gmail.com	$2b$10$VUebwoBTjvIetTMO/X5rTePtly7Xk4tDzzb5ZBwgtzqasC/2hwvUW	123456789	\N	1
3	Gastone			gastone@gmail.com	$2b$10$T2lyncnQkyiSfkuXuy3GuO8XiTU4G9hCdvqq7hF2MQKeOWM1cmDt2		\N	1
6	Alessio	Butticè	\N	\N	\N	\N	\N	3
5	Stefano	Buttcè	\N	stefano@gmail.com	\N	684648465468	\N	3
7	Samuele	Randisi	\N	\N	\N	\N	\N	3
4	Gabriele	Butticè	\N	gabriele@gmail.com	\N	584138541	\N	3
8	Gerlando	Cugino	\N	\N	\N	\N	\N	3
10	gabriele			gabriele@gmail.com	$2b$10$GDFR0.645XRI/JL44FtnI.SDicCfIV.KD7HVXoIYj.7I5RmBHwMeW		\N	1
11	1			1@gmail.com	$2b$10$kldEMZ4EixYGzQbqAXkjq.pMGMJvZkW4fYCY1bqtnPpvBYLd7ug0y		\N	1
12	Giustino	La Rocca	\N	giustinolarocca@example.com	\N	3665478951	Visita medica, UNILAV, DPI	11
13	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere - POS, DURC	11
14	Vasile Marian	Cristian	\N	\N	\N	\N	Manovale - Visita medica	11
15	Barrera	Mirko	\N	\N	\N	\N	Manovale - UNILAV	11
16	Cuffaro	Giuseppe	\N	\N	\N	\N	DPI consegnati	11
17	Esposito	Gennaro	\N	\N	\N	\N	Gruista	11
18	2			2@gmail.com	$2b$10$tOzZQBA0W8z4PIH5cs243.7COPkYMhmsRyA1QT142hHMFXMAE1adm		\N	1
19	Giustino	La Rocca	\N	giustinolarocca@example.com	\N	3665478951	Visita medica, UNILAV, DPI	18
20	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere - POS, DURC	18
21	Vasile Marian	Cristian	\N	\N	\N	\N	Manovale - Visita medica	18
22	Barrera	Mirko	\N	\N	\N	\N	Manovale - UNILAV	18
23	Cuffaro	Giuseppe	\N	\N	\N	\N	DPI consegnati	18
24	Esposito	Gennaro	\N	\N	\N	\N	Gruista	18
25	3@gmail.com			3@gmail.com	$2b$10$VNPIJ/qjMVwtjB.gcfke5.efYsusO3vi2yT5AZOhErOJYFYxqf/3W		\N	1
26	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	25
27	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	25
28	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	25
29	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	25
30	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	25
31	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	25
32	5@gmail.com			5@gmail.com	$2b$10$xFDfTo7VwdQr6JLWa8VKOuU3Y1uCyTpCWYTx6MEW3geNZ2iyVYyhW		\N	1
33	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	32
34	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	32
35	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	32
36	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	32
37	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	32
38	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	32
39	a			a@gmail.com	$2b$10$3Wuhgc.6fI/Fjpm0H0z8N.iM8aliIo60fXx7DtlrvYVaHeOoW2afC		\N	1
40	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	39
41	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	39
42	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	39
43	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	39
44	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	39
45	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	39
46	yo@gmail.com			yo@gmail.com	$2b$10$DqWF2EDEYn.javDTEobJdu6xB0JKbfoCeywBecpmjWrprhkeiWpOq		\N	1
47	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	46
48	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	46
49	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	46
50	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	46
51	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	46
52	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	46
53	ei			ei@gmail.com	$2b$10$NOulP2PoxRFRR1M/0c/WiORfwitaTyf/eRNNan2gwpOqW52YwxdDm		\N	1
54	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	53
55	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	53
56	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	53
57	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	53
58	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	53
59	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	53
60	halo			halo@gmail.com	$2b$10$fHG05fwQwvV.WjSYbbtLDeG4YGBxcvvFAF02J.NjU33vJk0FuhDp2		\N	1
61	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	60
62	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	60
63	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	60
64	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	60
65	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	60
66	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	60
67	hola@gmail.com			hola@gmail.com	$2b$10$qrCP2nDR/ZW/8sxxz9JQFuQiz8sp.o2S3Kb9QThCc7LpIZk8gI2gy		\N	1
68	Giustino	La Rocca	\N	\N	\N	\N	Responsabile impianti	67
69	Russo Morto	Salvatore	\N	\N	\N	\N	Carpentiere esperto	67
70	Vasile Marian	Cristian	\N	\N	\N	\N	Patente C	67
71	Barrera	Mirko	\N	\N	\N	\N	Finiture interne	67
72	Cuffaro	Giuseppe	\N	\N	\N	\N	Direzione lavori	67
73	Esposito	Gennaro	\N	\N	\N	\N	Controllo POS e DPI	67
\.


--
-- Data for Name: users_building_sites; Type: TABLE DATA; Schema: public; Owner: postgres
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
\.


--
-- Data for Name: users_companies; Type: TABLE DATA; Schema: public; Owner: postgres
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
\.


--
-- Data for Name: users_teams; Type: TABLE DATA; Schema: public; Owner: postgres
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
-- Data for Name: users_user_type; Type: TABLE DATA; Schema: public; Owner: postgres
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
\.


--
-- Name: building_sites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.building_sites_id_seq', 20, true);


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.companies_id_seq', 43, true);


--
-- Name: daily_notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.daily_notes_id_seq', 174, true);


--
-- Name: daily_presences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.daily_presences_id_seq', 1020, true);


--
-- Name: documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.documents_id_seq', 1, false);


--
-- Name: files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.files_id_seq', 99, true);


--
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teams_id_seq', 2, true);


--
-- Name: user_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_type_id_seq', 58, true);


--
-- Name: users_bulding_sites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_bulding_sites_id_seq', 62, true);


--
-- Name: users_companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_companies_id_seq', 64, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 73, true);


--
-- Name: users_teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_teams_id_seq', 12, true);


--
-- Name: users_user_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_type_id_seq', 77, true);


--
-- Name: building_sites building_sites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.building_sites
    ADD CONSTRAINT building_sites_pkey PRIMARY KEY (id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: daily_notes daily_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_notes
    ADD CONSTRAINT daily_notes_pkey PRIMARY KEY (id);


--
-- Name: daily_presences daily_presences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_presences
    ADD CONSTRAINT daily_presences_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: files files_storage_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_storage_key_key UNIQUE (storage_key);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: daily_notes unique_building_site_date; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_notes
    ADD CONSTRAINT unique_building_site_date UNIQUE (building_site_id, date);


--
-- Name: users_building_sites unique_user_site; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_building_sites
    ADD CONSTRAINT unique_user_site UNIQUE (user_id, site_id);


--
-- Name: user_type user_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_type
    ADD CONSTRAINT user_type_pkey PRIMARY KEY (id);


--
-- Name: users_building_sites users_bulding_sites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_building_sites
    ADD CONSTRAINT users_bulding_sites_pkey PRIMARY KEY (id);


--
-- Name: users_companies users_companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_companies
    ADD CONSTRAINT users_companies_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_teams users_teams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_teams
    ADD CONSTRAINT users_teams_pkey PRIMARY KEY (id);


--
-- Name: users_user_type users_user_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_user_type
    ADD CONSTRAINT users_user_type_pkey PRIMARY KEY (id);


--
-- Name: daily_notes daily_notes_building_site_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_notes
    ADD CONSTRAINT daily_notes_building_site_id_fkey FOREIGN KEY (building_site_id) REFERENCES public.building_sites(id) ON DELETE CASCADE;


--
-- Name: daily_presences daily_presences_building_site_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_presences
    ADD CONSTRAINT daily_presences_building_site_id_fkey FOREIGN KEY (building_site_id) REFERENCES public.building_sites(id) ON DELETE CASCADE;


--
-- Name: daily_presences daily_presences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_presences
    ADD CONSTRAINT daily_presences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: documents documents_file_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_file_id_fkey FOREIGN KEY (file_id) REFERENCES public.files(id) ON DELETE CASCADE;


--
-- Name: building_sites fk_building_sites_owner; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.building_sites
    ADD CONSTRAINT fk_building_sites_owner FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: companies fk_companies_owner; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT fk_companies_owner FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: daily_notes fk_daily_notes_owner; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_notes
    ADD CONSTRAINT fk_daily_notes_owner FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: daily_presences fk_daily_presences_owner; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_presences
    ADD CONSTRAINT fk_daily_presences_owner FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: files fk_files_building_site_id_building_sites_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT fk_files_building_site_id_building_sites_id FOREIGN KEY (building_site_id) REFERENCES public.building_sites(id);


--
-- Name: files fk_files_owner_id_users_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT fk_files_owner_id_users_id FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: user_type fk_user_type_owner; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_type
    ADD CONSTRAINT fk_user_type_owner FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users fk_users_owner; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_owner FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_building_sites users_bulding_sites_site_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_building_sites
    ADD CONSTRAINT users_bulding_sites_site_id_fkey FOREIGN KEY (site_id) REFERENCES public.building_sites(id) ON DELETE CASCADE;


--
-- Name: users_building_sites users_bulding_sites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_building_sites
    ADD CONSTRAINT users_bulding_sites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_companies users_companies_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_companies
    ADD CONSTRAINT users_companies_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: users_companies users_companies_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_companies
    ADD CONSTRAINT users_companies_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_teams users_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_teams
    ADD CONSTRAINT users_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: users_teams users_teams_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_teams
    ADD CONSTRAINT users_teams_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_user_type users_user_type_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_user_type
    ADD CONSTRAINT users_user_type_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_user_type users_user_type_user_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_user_type
    ADD CONSTRAINT users_user_type_user_type_id_fkey FOREIGN KEY (user_type_id) REFERENCES public.user_type(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict dmV32D9CevT7D0xfwxhQ6Pm7lFblGyHmGeqC9eFUrdqMIYUrqUUOXeYsrxCiJur

