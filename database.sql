CREATE TABLE public.user (
    	id uuid NOT NULL,
        email varchar(255) NOT NULL,
        role varchar(255) NULL,
        wrong_login_attempts_cycle integer[] NULL,
        restoring_token varchar(255) NULL,
        restoring_token_create_date timestamptz NOT NULL,
        token varchar(255) NULL,
        lang varchar(255) NULL,
        identifier varchar(255) NULL,
        mark varchar(255) NULL,
        mark_create_date timestamptz NOT NULL,
        last_login_date timestamptz NOT NULL,
        date_of_deactivation timestamptz NOT NULL,
        mark_create_date timestamptz NOT NULL,
        enabled bool NOT NULL DEFAULT true,
        limitedAccess bool NOT NULL DEFAULT true,
        email_token varchar(255) NULL,
        unsubscribe_email bool NOT NULL DEFAULT true,
        CONSTRAINT user_email_key UNIQUE (email),
        CONSTRAINT user_pkey PRIMARY KEY (id)
);

CREATE TABLE public.recommendedgamenews (
    	id uuid NOT NULL,
    	name varchar(255) NOT NULL,
    	description varchar(255) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
);

CREATE TABLE public.tests (
	id uuid NOT NULL,
	lang varchar(255) NOT NULL,
   	type varchar(255) NOT NULL,
	formula varchar(255) NOT NULL,
    	status varchar(255) NOT NULL,
	results  text[] NOT NULL,
	testMeasurements  integer[] NOT NULL,
	testQuestions  text[] NOT NULL,
	measurementUnits varchar(255) NOT NULL,
	measurementCompare varchar(255) NOT NULL,
	subtype varchar(255) NOT NULL,
	clearResults  bool NOT NULL DEFAULT false,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
	bodyPart_id uuid NULL,
	CONSTRAINT tests_pkey PRIMARY KEY (id),
	CONSTRAINT tests_bodyPart_id_fkey FOREIGN KEY (bodyPart_id) REFERENCES bodyParts(id) ON UPDATE CASCADE ON DELETE CASCADE,
);

CREATE TABLE public.patientexercisenews (
	id uuid NOT NULL,
	repetition integer NOT NULL,
  	duration integer NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
	patientLid_id uuid NULL,
    	exercise_id uuid NULL,
	CONSTRAINT patientexercisenews_pkey PRIMARY KEY (id),
	CONSTRAINT patientexercisenews_patientLid_id_fkey FOREIGN KEY (patientLid_id) REFERENCES patientLids(id) ON UPDATE CASCADE ON DELETE CASCADE,
    	CONSTRAINT patientexercisenews_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON UPDATE CASCADE ON DELETE CASCADE,
);

CREATE TABLE public.exercises (
	id uuid NOT NULL,
	name varchar(255) NOT NULL,
    	link varchar(255) NOT NULL,
	pictureLink varchar(255) NOT NULL,
    	lang varchar(255) NOT NULL,
    	classifierId varchar(255) NOT NULL,
    	description varchar(255) NOT NULL,
    	displayForPatient bool NOT NULL DEFAULT true,
    	displayForSpecialist bool NOT NULL DEFAULT true,
    	forGames  text[] NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
	bodyPart_id uuid NULL,
    	translation_id uuid NULL,
	specialist_id uuid NULL,
	CONSTRAINT exercises_pkey PRIMARY KEY (id),
	CONSTRAINT exercises_bodyPart_id_fkey FOREIGN KEY (bodyPart_id) REFERENCES bodyParts(id) ON UPDATE CASCADE ON DELETE CASCADE,
    	CONSTRAINT exercises_translation_id_fkey FOREIGN KEY (translation_id) REFERENCES translations(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT exercises_specialist_id_fkey FOREIGN KEY (specialist_id) REFERENCES specialists(id) ON UPDATE CASCADE ON DELETE CASCADE,
);

CREATE TABLE public.patientlids (
	id uuid NOT NULL,
	content jsonb NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
	user_id uuid NOT NULL,
	achievement_id uuid NULL,
	CONSTRAINT patientlids_pkey PRIMARY KEY (id),
	CONSTRAINT patientlids_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT patientlids_user_id_fkey FOREIGN KEY (user_id) REFERENCES user(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE public.patientquestiondeletegames (
	id uuid NOT NULL,
    	question varchar(255) NOT NULL,
	game varchar(255) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
	patient_id uuid NULL,
	CONSTRAINT patientquestiondeletegames_pkey PRIMARY KEY (id),
	CONSTRAINT patientquestiondeletegames_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES patients(id) ON UPDATE CASCADE ON DELETE CASCADE,
);

CREATE TABLE public.histories (
	id uuid NOT NULL,
    	action varchar(255) NOT NULL,
	result varchar(255) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
    	hospital_id uuid NULL,
	specialist_id uuid NULL,
    	patient_id uuid NULL,
	CONSTRAINT histories_pkey PRIMARY KEY (id),
    	CONSTRAINT histories_hospital_id_fkey FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT histories_specialist_id_fkey FOREIGN KEY (specialist_id) REFERENCES specialists(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT histories_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES patients(id) ON UPDATE CASCADE ON DELETE CASCADE,
);

CREATE TABLE public.privacypolicies (
	id uuid NOT NULL,
	lang varchar(255) NOT NULL,
    	checkboxtext varchar(255) NOT NULL,
	buttontext varchar(255) NOT NULL,
    	titletext varchar(255) NOT NULL,
    	text varchar(255) NOT NULL,
);

CREATE TABLE public.patientdiagnoses (
	id uuid NOT NULL,
	diagnosis varchar(255) NOT NULL,
    	lang varchar(255) NOT NULL,
);

CREATE TABLE public.patientgamenews (
	id uuid NOT NULL,
    	last_session timestamptz NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
    	patient_lid_id uuid NULL,
	recomended_game_new_id uuid NULL,
	CONSTRAINT patientgamenews_pkey PRIMARY KEY (id),
    	CONSTRAINT patientgamenews_patient_lid_id_fkey FOREIGN KEY (patient_lid_id) REFERENCES patientLids(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT patientgamenews_recomended_game_new_id_fkey FOREIGN KEY (recomended_game_new_id) REFERENCES recomendedGameNews(id) ON UPDATE CASCADE ON DELETE CASCADE,
);

CREATE TABLE public.bodyparts (
	id uuid NOT NULL,
    	name varchar(255) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
);

CREATE TABLE public.recommendedgames (
	id uuid NOT NULL,
    	name varchar(255) NOT NULL,
    	path varchar(255) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
);

CREATE TABLE public.cities (
	id uuid NOT NULL,
    	name varchar(255) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
    	country_id uuid NULL,
	CONSTRAINT cities_pkey PRIMARY KEY (id),
    	CONSTRAINT cities_country_id_fkey FOREIGN KEY (country_id) REFERENCES countries(id) ON UPDATE CASCADE ON DELETE CASCADE,
);

CREATE TABLE public.faqstatistics (
	id uuid NOT NULL,
   	views integer NOT NULL,
    	positive integer NOT NULL,
    	negative integer NOT NULL,
    	comments text[] NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
);

CREATE TABLE public.tymeoftrainings (
	id uuid NOT NULL,
    	time integer NOT NULL,
    	date timestamptz NULL,
);

CREATE TABLE public.patientexercises (
	id uuid NOT NULL,
    	totalTime integer NOT NULL,
	comment varchar(255) NOT NULL,
    	date_from timestamptz NOT NULL,
	date_to timestamptz NOT NULL,
    	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
    	deleted_at timestamptz NULL,
    	exercise_id uuid NULL,
	specialist_id uuid NULL,
    	patient_id uuid NULL,
    	settings_id uuid NULL,
	CONSTRAINT patientexercises_pkey PRIMARY KEY (id),
    	CONSTRAINT patientexercises_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT patientexercises_specialist_id_fkey FOREIGN KEY (specialist_id) REFERENCES specialists(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT patientexercises_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES patients(id) ON UPDATE CASCADE ON DELETE CASCADE,
    	CONSTRAINT patientexercises_settings_id_fkey FOREIGN KEY (settings_id) REFERENCES settings(id) ON UPDATE CASCADE ON DELETE CASCADE,
);

CREATE TABLE public.cards (
	id uuid NOT NULL,
    	last4 integer NOT NULL,
    	exp_year integer NOT NULL,
    	exp_month integer NOT NULL,
    	brand integer NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
    	country_id uuid NULL,
	CONSTRAINT cards_pkey PRIMARY KEY (id),
    	CONSTRAINT cards_country_id_fkey FOREIGN KEY (country_id) REFERENCES countries(id) ON UPDATE CASCADE ON DELETE CASCADE,
);

CREATE TABLE public.achievements (
	id uuid NOT NULL,
    	game_names text[] NOT NULL,
    	total_amount_of_time_in_game integer NOT NULL,
    	answers_count integer NOT NULL,
	start_date timestamptz NOT NULL,
	end_date timestamptz NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
    	patient_id uuid NULL,
	CONSTRAINT achievements_pkey PRIMARY KEY (id),
    	CONSTRAINT achievements_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES patients(id) ON UPDATE CASCADE ON DELETE CASCADE,
);

CREATE TABLE public.patientsettings (
	id uuid NOT NULL,
    	patient_position integer NOT NULL,
    	path integer NOT NULL,
);

CREATE TABLE public.patientquestionfeelings (
	id uuid NOT NULL,
    	question_before varchar(255) NOT NULL,
    	question_after varchar(255) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
    	patient_id uuid NULL,
    	game_id uuid NULL,
	CONSTRAINT patientquestionfeelings_pkey PRIMARY KEY (id),
    	CONSTRAINT patientquestionfeelings_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES patients(id) ON UPDATE CASCADE ON DELETE CASCADE,
    	CONSTRAINT patientquestionfeelings_game_id_fkey FOREIGN KEY (game_id) REFERENCES games(id) ON UPDATE CASCADE ON DELETE CASCADE,
);

CREATE TABLE public.faqconfigs (
	id uuid NOT NULL,
    	lang varchar(255) NOT NULL,
    	role varchar(255) NOT NULL,
    	faq_item text[] NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
);
