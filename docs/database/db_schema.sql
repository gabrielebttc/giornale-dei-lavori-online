--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13
-- Dumped by pg_dump version 15.13

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
    last_name character varying(100),
    username character varying(50),
    email character varying(100),
    password character varying(255),
    phone character varying(15),
    notes text,
    owner_id integer NOT NULL
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
-- Name: teams id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);


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
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


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

