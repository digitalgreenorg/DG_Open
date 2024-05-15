--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4 (Debian 15.4-2.pgdg120+1)
-- Dumped by pg_dump version 15.4 (Debian 15.4-2.pgdg120+1)

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

--
-- Data for Name: language; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.language (id, created_on, updated_on, is_active, is_deleted, name, display_name, code, latn_code, bcp_code) FROM stdin;
1	2023-10-10 08:57:45.859186	2023-10-10 08:57:45.859186	t	f	English	English	en	en-Latn	en-IN
2	2023-10-10 09:02:00.952768	2023-10-10 09:02:00.952768	t	f	Spanish	Español (Spanish)	es	es-Latn	es-ES
3	2023-10-10 09:02:00.952768	2023-10-10 09:02:00.952768	t	f	Hindi	हिंदी (Hindi)	hi	hi-Latn	hi-IN
\.


--
-- Data for Name: multilingual_text; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.multilingual_text (id, created_on, updated_on, is_active, is_deleted, language_id, text_code, text) FROM stdin;
1	2024-05-14 06:45:41.192133	2024-05-14 06:45:41.192144	t	f	1	sorry_something_went_wrong_message_en	Sorry, something went wrong. Please try again.
2	2024-05-14 06:45:41.32962	2024-05-14 06:45:41.329629	t	f	3	sorry_something_went_wrong_message_hi	क्षमा करें, कुछ गलत हो गया। कृपया फिर से प्रयास करें.
3	2024-05-14 06:45:41.499734	2024-05-14 06:45:41.499745	t	f	2	sorry_something_went_wrong_message_es	Perdón, algo salió mal. Inténtalo de nuevo.
4	2024-05-14 06:45:41.705287	2024-05-14 06:45:41.705296	t	f	1	could_not_understand_message_en	Apologize! I could not understand. Please try again.
5	2024-05-14 06:45:41.90912	2024-05-14 06:45:41.909129	t	f	3	could_not_understand_message_hi	क्षमा करें,मुझे समझ नहीं आया. कृपया फिर से प्रयास करें.
6	2024-05-14 06:45:42.113988	2024-05-14 06:45:42.113997	t	f	2	could_not_understand_message_es	¡Disculparse! No lo pude entender. Inténtalo de nuevo.
\.


--
-- PostgreSQL database dump complete
--

