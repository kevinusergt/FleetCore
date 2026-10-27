--
-- PostgreSQL database dump
--

\restrict 3jcdIdQ8TZFixoxkPgmQEoUC2cEYgh9QZTReyJHPj8pECxfB5diFYE6I3yCkiYe

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

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

ALTER TABLE IF EXISTS ONLY public.maintenances DROP CONSTRAINT IF EXISTS "FK_daa193fdfccde41a2ed4de8a474";
ALTER TABLE IF EXISTS ONLY public.maintenances DROP CONSTRAINT IF EXISTS "FK_75331cd2a0f0c22bcb2fc4f6d6a";
ALTER TABLE IF EXISTS ONLY public.maintenances DROP CONSTRAINT IF EXISTS "FK_3a9ba7c05e1ffba00560d11f364";
ALTER TABLE IF EXISTS ONLY public.vehicles DROP CONSTRAINT IF EXISTS "UQ_ec7181ebdab798d97070122a5bf";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS "UQ_97672ac88f789774dd47f7c8be3";
ALTER TABLE IF EXISTS ONLY public.mechanics DROP CONSTRAINT IF EXISTS "UQ_301c3b5fa2d49aab65dcfda36a6";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS "PK_a3ffb1c0c8416b9fc6f907b7433";
ALTER TABLE IF EXISTS ONLY public.workshops DROP CONSTRAINT IF EXISTS "PK_6d0e82a124f5b53df91c8989848";
ALTER TABLE IF EXISTS ONLY public.maintenances DROP CONSTRAINT IF EXISTS "PK_62403473bd524a42d58589aa78b";
ALTER TABLE IF EXISTS ONLY public.mechanics DROP CONSTRAINT IF EXISTS "PK_2c0ed23afc0cc7ff361c17e53df";
ALTER TABLE IF EXISTS ONLY public.vehicles DROP CONSTRAINT IF EXISTS "PK_18d8646b59304dce4af3a9e35b6";
ALTER TABLE IF EXISTS public.workshops ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.vehicles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.mechanics ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.maintenances ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.workshops_id_seq;
DROP TABLE IF EXISTS public.workshops;
DROP SEQUENCE IF EXISTS public.vehicles_id_seq;
DROP TABLE IF EXISTS public.vehicles;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.mechanics_id_seq;
DROP TABLE IF EXISTS public.mechanics;
DROP SEQUENCE IF EXISTS public.maintenances_id_seq;
DROP TABLE IF EXISTS public.maintenances;
DROP TYPE IF EXISTS public.vehicles_status_enum;
DROP TYPE IF EXISTS public.users_role_enum;
DROP TYPE IF EXISTS public.maintenances_type_enum;
DROP TYPE IF EXISTS public.maintenances_status_enum;
--
-- Name: maintenances_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.maintenances_status_enum AS ENUM (
    'SCHEDULED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public.maintenances_status_enum OWNER TO postgres;

--
-- Name: maintenances_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.maintenances_type_enum AS ENUM (
    'PREVENTIVE',
    'CORRECTIVE'
);


ALTER TYPE public.maintenances_type_enum OWNER TO postgres;

--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.users_role_enum AS ENUM (
    'ADMIN',
    'TECHNICIAN'
);


ALTER TYPE public.users_role_enum OWNER TO postgres;

--
-- Name: vehicles_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.vehicles_status_enum AS ENUM (
    'AVAILABLE',
    'IN_MAINTENANCE',
    'INACTIVE'
);


ALTER TYPE public.vehicles_status_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: maintenances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maintenances (
    id integer NOT NULL,
    type public.maintenances_type_enum NOT NULL,
    description text NOT NULL,
    mileage integer NOT NULL,
    "scheduledAt" timestamp without time zone NOT NULL,
    status public.maintenances_status_enum DEFAULT 'SCHEDULED'::public.maintenances_status_enum NOT NULL,
    "scheduledEndAt" timestamp without time zone,
    "workPerformed" text,
    "finalCost" numeric(12,2),
    "completedAt" timestamp without time zone,
    "finalMileage" integer,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "vehicleId" integer NOT NULL,
    "mechanicId" integer NOT NULL,
    "workshopId" integer NOT NULL
);


ALTER TABLE public.maintenances OWNER TO postgres;

--
-- Name: maintenances_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.maintenances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenances_id_seq OWNER TO postgres;

--
-- Name: maintenances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.maintenances_id_seq OWNED BY public.maintenances.id;


--
-- Name: mechanics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mechanics (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(180) NOT NULL,
    specialty character varying(100) NOT NULL,
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.mechanics OWNER TO postgres;

--
-- Name: mechanics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mechanics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mechanics_id_seq OWNER TO postgres;

--
-- Name: mechanics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mechanics_id_seq OWNED BY public.mechanics.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(180) NOT NULL,
    password character varying NOT NULL,
    role public.users_role_enum DEFAULT 'TECHNICIAN'::public.users_role_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

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
-- Name: vehicles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicles (
    id integer NOT NULL,
    plate character varying(20) NOT NULL,
    brand character varying(80) NOT NULL,
    model character varying(80) NOT NULL,
    year integer NOT NULL,
    mileage integer DEFAULT 0 NOT NULL,
    status public.vehicles_status_enum DEFAULT 'AVAILABLE'::public.vehicles_status_enum NOT NULL
);


ALTER TABLE public.vehicles OWNER TO postgres;

--
-- Name: vehicles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vehicles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehicles_id_seq OWNER TO postgres;

--
-- Name: vehicles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vehicles_id_seq OWNED BY public.vehicles.id;


--
-- Name: workshops; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workshops (
    id integer NOT NULL,
    name character varying(120) NOT NULL,
    address character varying(240) NOT NULL,
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.workshops OWNER TO postgres;

--
-- Name: workshops_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.workshops_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.workshops_id_seq OWNER TO postgres;

--
-- Name: workshops_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.workshops_id_seq OWNED BY public.workshops.id;


--
-- Name: maintenances id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenances ALTER COLUMN id SET DEFAULT nextval('public.maintenances_id_seq'::regclass);


--
-- Name: mechanics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mechanics ALTER COLUMN id SET DEFAULT nextval('public.mechanics_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vehicles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles ALTER COLUMN id SET DEFAULT nextval('public.vehicles_id_seq'::regclass);


--
-- Name: workshops id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workshops ALTER COLUMN id SET DEFAULT nextval('public.workshops_id_seq'::regclass);


--
-- Data for Name: maintenances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maintenances (id, type, description, mileage, "scheduledAt", status, "scheduledEndAt", "workPerformed", "finalCost", "completedAt", "finalMileage", "createdAt", "updatedAt", "vehicleId", "mechanicId", "workshopId") FROM stdin;
1	PREVENTIVE	Cambio de aceite y filtros - historial	40000	2026-08-01 03:00:00	COMPLETED	2026-08-01 04:00:00	Cambio de aceite, filtros y revisión general	350000.00	2026-08-01 04:00:00	40050	2026-10-27 15:35:27.077336	2026-10-27 15:35:27.077336	1	1	1
2	CORRECTIVE	Diagnóstico de frenos en curso	68000	2026-10-27 10:05:27.08	IN_PROGRESS	2026-10-27 11:05:27.08	\N	\N	\N	\N	2026-10-27 15:35:27.080447	2026-10-27 15:35:27.080447	3	2	1
\.


--
-- Data for Name: mechanics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mechanics (id, name, email, specialty, active) FROM stdin;
1	Ana Technician	ana@fleetcore.local	Mecánica general	t
2	Luis Technician	luis@fleetcore.local	Electricidad automotriz	t
3	Mecánico Inactivo	inactive@fleetcore.local	Motor diésel	f
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, role, "createdAt") FROM stdin;
1	Fleet Admin	admin@fleetcore.local	$2b$12$Yt6QQPP04xaAEOamdrwqaeeR4CpjrGj7AFqW0UXtgtiMCZdQRmiPO	ADMIN	2026-10-27 15:35:26.652411
2	Ana Technician	ana@fleetcore.local	$2b$12$/gl/tDcno1nBv1PDWACFHegGWJX8UAPvLCXRLic9Eb1GrpmSb7pWO	TECHNICIAN	2026-10-27 15:35:26.850061
3	Luis Technician	luis@fleetcore.local	$2b$12$k4SPzg20TW/cAEUiDhbwyu/a4uhoRe4xyZnZlSc3mCXKD2NbW0b06	TECHNICIAN	2026-10-27 15:35:27.04971
\.


--
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicles (id, plate, brand, model, year, mileage, status) FROM stdin;
2	FLC102	Renault	Duster	2021	36000	AVAILABLE
4	FLC104	Mazda	3	2018	80000	INACTIVE
1	FLC101	Toyota	Corolla	2020	40050	AVAILABLE
3	FLC103	Chevrolet	Onix	2019	68000	IN_MAINTENANCE
\.


--
-- Data for Name: workshops; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workshops (id, name, address, active) FROM stdin;
1	Taller Central	Calle 30 # 10-20	t
2	Taller Norte Inactivo	Carrera 50 # 80-10	f
\.


--
-- Name: maintenances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.maintenances_id_seq', 2, true);


--
-- Name: mechanics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mechanics_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: vehicles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vehicles_id_seq', 4, true);


--
-- Name: workshops_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.workshops_id_seq', 2, true);


--
-- Name: vehicles PK_18d8646b59304dce4af3a9e35b6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY (id);


--
-- Name: mechanics PK_2c0ed23afc0cc7ff361c17e53df; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mechanics
    ADD CONSTRAINT "PK_2c0ed23afc0cc7ff361c17e53df" PRIMARY KEY (id);


--
-- Name: maintenances PK_62403473bd524a42d58589aa78b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenances
    ADD CONSTRAINT "PK_62403473bd524a42d58589aa78b" PRIMARY KEY (id);


--
-- Name: workshops PK_6d0e82a124f5b53df91c8989848; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workshops
    ADD CONSTRAINT "PK_6d0e82a124f5b53df91c8989848" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: mechanics UQ_301c3b5fa2d49aab65dcfda36a6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mechanics
    ADD CONSTRAINT "UQ_301c3b5fa2d49aab65dcfda36a6" UNIQUE (email);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: vehicles UQ_ec7181ebdab798d97070122a5bf; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT "UQ_ec7181ebdab798d97070122a5bf" UNIQUE (plate);


--
-- Name: maintenances FK_3a9ba7c05e1ffba00560d11f364; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenances
    ADD CONSTRAINT "FK_3a9ba7c05e1ffba00560d11f364" FOREIGN KEY ("mechanicId") REFERENCES public.mechanics(id) ON DELETE RESTRICT;


--
-- Name: maintenances FK_75331cd2a0f0c22bcb2fc4f6d6a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenances
    ADD CONSTRAINT "FK_75331cd2a0f0c22bcb2fc4f6d6a" FOREIGN KEY ("workshopId") REFERENCES public.workshops(id) ON DELETE RESTRICT;


--
-- Name: maintenances FK_daa193fdfccde41a2ed4de8a474; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenances
    ADD CONSTRAINT "FK_daa193fdfccde41a2ed4de8a474" FOREIGN KEY ("vehicleId") REFERENCES public.vehicles(id) ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict 3jcdIdQ8TZFixoxkPgmQEoUC2cEYgh9QZTReyJHPj8pECxfB5diFYE6I3yCkiYe

