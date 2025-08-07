--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Ubuntu 14.18-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.18 (Ubuntu 14.18-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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


ALTER TABLE public.building_sites_id_seq OWNER TO postgres;

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


ALTER TABLE public.companies_id_seq OWNER TO postgres;

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


ALTER TABLE public.daily_notes_id_seq OWNER TO postgres;

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
    CONSTRAINT daily_presences_is_present_check CHECK (((is_present)::text = ANY ((ARRAY['present'::character varying, 'absent'::character varying, 'not_required'::character varying])::text[])))
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


ALTER TABLE public.daily_presences_id_seq OWNER TO postgres;

--
-- Name: daily_presences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.daily_presences_id_seq OWNED BY public.daily_presences.id;


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


ALTER TABLE public.teams_id_seq OWNER TO postgres;

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


ALTER TABLE public.user_type_id_seq OWNER TO postgres;

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


ALTER TABLE public.users_bulding_sites_id_seq OWNER TO postgres;

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


ALTER TABLE public.users_companies_id_seq OWNER TO postgres;

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


ALTER TABLE public.users_id_seq OWNER TO postgres;

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


ALTER TABLE public.users_teams_id_seq OWNER TO postgres;

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


ALTER TABLE public.users_user_type_id_seq OWNER TO postgres;

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
3	cantieruccio	fajldaohj	Cortina sulla strada del vino	\N	46.268689	11.222594	21	2025-08-06	\N
4	cantiere chiesa madre	\N	Raffadali	\N	37.404897	13.531094	21	2025-08-06	\N
5	Casa Gabriele Butticè	me cuscinu	Raffadali	Via E 7 n.3	37.404897	13.531094	21	2025-08-06	\N
6	Casa mia	\N	Siculiana	entrata di siculiana marina	37.336485	13.420043	21	2025-08-06	\N
1	Chiesa di Gianluca	Chiesa a Siracusa	Siracusa	Via delle peppine 18	37.059917	15.293332	21	2025-08-06	\N
8	Casa di Man	Casetta a mare	Trapani	vicinissimo al mare, babe	38.018501	12.513657	25	2025-08-06	\N
7	policlinio	oggi no sono online, happy days	Catania	boh, cazzzzo ne so baby	37.502878	15.087047	25	2025-08-01	2025-08-31
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (id, name, notes, owner_id) FROM stdin;
2	Costruzioni veloci	boooh	21
3	Idraulici Raffadalesi	L'azienda di dru carduni	21
4	Enel	bohpt	21
8	azienda di Siracusa	\N	21
10	Muratori Raffadalesi	\N	25
11	Libero Professionista	\N	25
12	KSM sicurezza privata	\N	25
\.


--
-- Data for Name: daily_notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.daily_notes (id, date, building_site_id, notes, other_notes, personal_notes, owner_id) FROM stdin;
1	2025-08-04	1	Queste sono annotazioni speciali e generali	Queste sono osservazioni e istruzioni	queste sono strettamente personaliii ahahahahahha	21
7	2025-08-06	7	Tante belle cose	esco per i fatti mieiii	ci<aoolkmf.s,d	25
13	2025-08-07	7	E altre annotazioni nuove	\N	\N	25
\.


--
-- Data for Name: daily_presences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.daily_presences (id, building_site_id, user_id, date, is_present, notes, owner_id) FROM stdin;
58	7	26	2025-08-06	present	Arrivato tardino il coglione	25
59	7	27	2025-08-06	present	\N	25
60	7	28	2025-08-06	present	\N	25
61	7	29	2025-08-06	present	\N	25
62	7	30	2025-08-06	present	\N	25
63	7	31	2025-08-06	present	\N	25
64	7	32	2025-08-06	present	\N	25
65	7	33	2025-08-06	present	\N	25
66	7	34	2025-08-06	present	\N	25
67	7	35	2025-08-06	present	\N	25
68	7	36	2025-08-06	present	\N	25
69	7	26	2025-08-07	absent	compleanno della figlia	25
70	7	27	2025-08-07	absent	\N	25
71	7	28	2025-08-07	present	\N	25
72	7	29	2025-08-07	present	\N	25
73	7	30	2025-08-07	present	\N	25
74	7	31	2025-08-07	present	\N	25
75	7	32	2025-08-07	absent	\N	25
76	7	33	2025-08-07	present	\N	25
77	7	34	2025-08-07	present	\N	25
78	7	35	2025-08-07	present	\N	25
79	7	36	2025-08-07	present	\N	25
91	7	26	2025-08-08	absent	\N	25
92	7	27	2025-08-08	present	\N	25
93	7	28	2025-08-08	absent	\N	25
94	7	29	2025-08-08	absent	\N	25
95	7	30	2025-08-08	absent	\N	25
5	1	4	2025-08-05	present	\N	21
7	1	10	2025-08-05	not_required	\N	21
8	1	11	2025-08-05	not_required	\N	21
9	1	12	2025-08-05	not_required	\N	21
10	1	14	2025-08-05	not_required	\N	21
11	1	16	2025-08-05	not_required	\N	21
12	1	17	2025-08-05	not_required	\N	21
13	1	18	2025-08-05	not_required	\N	21
14	1	19	2025-08-05	not_required	\N	21
15	1	20	2025-08-05	not_required	\N	21
27	1	4	2025-08-03	present	Left early.	21
29	1	10	2025-08-03	present	\N	21
30	1	11	2025-08-03	present	\N	21
31	1	12	2025-08-03	present	\N	21
32	1	14	2025-08-03	present	\N	21
33	1	16	2025-08-03	present	\N	21
34	1	17	2025-08-03	present	\N	21
35	1	18	2025-08-03	present	\N	21
36	1	19	2025-08-03	present	\N	21
37	1	20	2025-08-03	present	\N	21
38	1	4	2025-08-04	present	arrivato tardi sto strunz	21
40	1	10	2025-08-04	present	\N	21
41	1	11	2025-08-04	present	\N	21
42	1	12	2025-08-04	not_required	\N	21
43	1	14	2025-08-04	not_required	\N	21
44	1	16	2025-08-04	not_required	\N	21
45	1	17	2025-08-04	not_required	\N	21
46	1	18	2025-08-04	not_required	\N	21
47	1	19	2025-08-04	not_required	\N	21
48	1	20	2025-08-04	not_required	\N	21
96	7	31	2025-08-08	not_required	\N	25
97	7	32	2025-08-08	not_required	\N	25
98	7	33	2025-08-08	absent	\N	25
99	7	34	2025-08-08	absent	\N	25
100	7	35	2025-08-08	not_required	\N	25
101	7	36	2025-08-08	present	\N	25
102	7	26	2025-08-19	absent	\N	25
103	7	27	2025-08-19	absent	\N	25
104	7	28	2025-08-19	present	\N	25
105	7	29	2025-08-19	present	\N	25
106	7	30	2025-08-19	present	\N	25
107	7	31	2025-08-19	present	\N	25
108	7	32	2025-08-19	present	\N	25
109	7	33	2025-08-19	present	\N	25
110	7	34	2025-08-19	present	\N	25
111	7	35	2025-08-19	present	\N	25
112	7	36	2025-08-19	present	\N	25
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teams (id, name) FROM stdin;
\.


--
-- Data for Name: user_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_type (id, name, owner_id) FROM stdin;
17	admin	\N
2	muratore	21
13	Idraulico	21
16	Elettricista	21
19	Muratore	25
20	Assicuratore	25
21	Imbianchino	25
22	Architetto	25
23	Ingegnere	25
24	Vigilante	25
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, first_name, last_name, username, email, password, phone, notes, owner_id) FROM stdin;
25	bello	malo	ciaoo 8465320	ciao@gmail.com	$2b$10$13Cj56UfzQZkkka4UIc4i.mALfA6bs6itmFTAkDAs4nWGaXfhRR1.	456132	adfjksnlf	21
26	Davide	Sicurello	\N	davide@gmail.com	\N	3665895214	lkkkkkkmlfads	25
27	Giovanni	La Marca	\N	\N	\N	\N	\N	25
29	Alberto	Cuffaro	\N	\N	\N	\N	\N	25
30	Vincenzo	Cuffaro	\N	\N	\N	\N	\N	25
31	Gabriele	Butticè	\N	\N	\N	\N	\N	25
32	Alessio	Butticè	\N	\N	\N	\N	\N	25
33	Davide	Sicurello	\N	\N	\N	\N	\N	25
34	Giuseppe	Sicurello	\N	\N	\N	\N	\N	25
35	Cristian	Cuffaro	\N	\N	\N	\N	\N	25
36	Flavio	Cuffaro	\N	\N	\N	\N	\N	25
28	Stefano	Butticè	\N		\N		Zio Stefano	25
8	Giorno	Di Caprio	\N	\N	\N	86453112	\N	21
12	Pasqualino	Marotta	\N	\N	\N	8645132846	\N	21
13	ziopeppe	di luca	\N	\N	\N	\N	\N	21
14	Pelato	Mutina	\N	\N	\N	987465216	\N	21
15	Peppino	Impastato	\N	\N	\N	\N	\N	21
16	Peppe	Carduni	\N	\N	\N	\N	\N	21
18	gabri	butti	\N	\N	\N	\N	\N	21
11	Alberto	Cuffaro	\N	albertino@gmail.com	\N	3667463829	hello	21
19	Maurizio	Merluzzo	\N	maurizio@gmail.com	\N	84653214865	wei la	21
17	bello	de zi	\N	fashkdfj@gmail.com	\N	48865132	\N	21
20	Sciao	Bello	\N	dfaskhj@gmail.com	\N	745321645152	notes	21
10	Gabrieluccio	Butticèè	\N	fkjahdsnkfm@gnialfk.com	\N	864521	fdas	21
4	Mario	Rossiccio	mario.rossi	mario.rossi@example.com	password123	1289455463	tfhtgjkl	21
21	Gabriele	Butticè	gabrielebttc	gabriele@gmail.com	$2b$10$aW2hVZD4KQpWwn9PfL1OVe.D2CIKL2DKFnP1rxml.v59hb/2zz1uu	3668603910	Profilo del creatore di questa webapp	21
22	fiokl	ldfm	fdlskfjlfjksl	dlfkasd@gmail.com	$2b$10$HnD.tF1Mik6J8wcoKeqUfOVcgXtMgTyPh1t4oIH70KkNbBeqUOxGC	864513256132	\N	21
1	Default	Owner	admin	admin@example.com	password	0000000000	Utente di sistema	21
\.


--
-- Data for Name: users_building_sites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_building_sites (id, user_id, site_id) FROM stdin;
2	4	1
3	10	1
4	11	1
5	12	1
6	15	3
7	16	1
8	17	1
9	18	1
10	19	1
11	20	1
12	14	1
14	4	5
16	11	5
17	14	5
18	19	5
22	26	7
23	26	8
24	27	7
25	28	7
26	29	7
27	30	7
28	31	7
29	32	7
30	33	7
31	34	7
32	35	7
33	36	7
\.


--
-- Data for Name: users_companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_companies (id, user_id, company_id) FROM stdin;
8	16	3
10	18	2
11	19	3
12	19	2
27	10	8
29	4	8
34	26	10
35	27	11
37	29	11
38	30	11
39	31	10
40	32	10
41	33	10
42	34	10
43	35	10
44	36	12
48	28	11
\.


--
-- Data for Name: users_teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_teams (id, user_id, team_id) FROM stdin;
\.


--
-- Data for Name: users_user_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_user_type (id, user_id, user_type_id) FROM stdin;
3	12	2
4	13	2
31	25	17
6	15	2
7	16	13
35	26	19
9	18	2
36	27	20
10	19	2
11	19	13
38	29	22
39	30	23
40	31	19
41	32	19
42	33	19
43	34	19
44	35	19
45	36	24
27	21	17
28	22	17
49	28	21
2	11	2
\.


--
-- Name: building_sites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.building_sites_id_seq', 8, true);


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.companies_id_seq', 12, true);


--
-- Name: daily_notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.daily_notes_id_seq', 13, true);


--
-- Name: daily_presences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.daily_presences_id_seq', 112, true);


--
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teams_id_seq', 1, false);


--
-- Name: user_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_type_id_seq', 24, true);


--
-- Name: users_bulding_sites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_bulding_sites_id_seq', 33, true);


--
-- Name: users_companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_companies_id_seq', 48, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 36, true);


--
-- Name: users_teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_teams_id_seq', 1, false);


--
-- Name: users_user_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_type_id_seq', 49, true);


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
-- Name: user_type unique_nome_tipo_di_utente; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_type
    ADD CONSTRAINT unique_nome_tipo_di_utente UNIQUE (name);


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

