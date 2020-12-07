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

CREATE TABLE public.hospitals (
	id uuid NOT NULL,
    	name integer NOT NULL,
	city varchar(255) NOT NULL,
    	date_from timestamptz NOT NULL,
	main_email varchar(255) NOT NULL,
  additional_email varchar(255) NOT NULL,
  hospital_status varchar(255) NOT NULL,
  news_and_updates bool NOT NULL DEFAULT true,
  stripe_customer_id varchar(255) NOT NULL,
  stripe_subscription_id varchar(255) NOT NULL,
    	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
    	deleted_at timestamptz NULL,
    	country_id uuid NULL,
      user_id uuid NULL,
      card_id uuid NULL,
	CONSTRAINT hospitals_pkey PRIMARY KEY (id),
    	CONSTRAINT hospitals_country_id_fkey FOREIGN KEY (country_id) REFERENCES countries(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT hospitals_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT hospitals_card_id_fkey FOREIGN KEY (card_id) REFERENCES cards(id) ON UPDATE CASCADE ON DELETE CASCADE,
);

CREATE TABLE public.specialists (
	id uuid NOT NULL,
    	first_name varchar(255) NOT NULL,
      last_name varchar(255) NOT NULL,
      date_of_hiring timestamptz NULL,
      date_of_firing timestamptz NULL,
      date_of_birth timestamptz NULL,
      gender varchar(255) NOT NULL,
      phone_number varchar(255) NOT NULL,
      experience varchar(255) NOT NULL,
      email varchar(255) NOT NULL,
      first_login bool NOT NULL DEFAULT true,
      specialist_status varchar(255) NOT NULL,
      specialist_specialization uuid NULL,
      hostipal_id uuid NULL,
      user_id uuid NULL,
    	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
    	deleted_at timestamptz NULL,
    	country_id uuid NULL,
      card_id uuid NULL,
	CONSTRAINT specialists_pkey PRIMARY KEY (id),
    	CONSTRAINT specialists_specialist_specialization_id_fkey FOREIGN KEY (specialist_specialization_id) REFERENCES specialist_specializations(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT specialists_hospital_id_fkey FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT specialists_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
);

CREATE TABLE public.patienttestresults (
	id uuid NOT NULL,
  reference_results text[] NOT NULL,
  patient_results text[] NOT NULL,
  lang varchar(255) NOT NULL,
  result varchar(255) NOT NULL,
  description varchar(255) NOT NULL,
  _date timestamptz NULL,
      patient_id uuid NULL,
      test_id uuid NULL,
    	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
    	deleted_at timestamptz NULL,
	CONSTRAINT patienttestresults_pkey PRIMARY KEY (id),
    	CONSTRAINT patienttestresults_patient_id_fkey FOREIGN KEY (patient_id_id) REFERENCES patients(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT patienttestresults_test_id_fkey FOREIGN KEY (test_id) REFERENCES tests(id) ON UPDATE CASCADE ON DELETE CASCADE,
);

CREATE TABLE public.emails (
	id uuid NOT NULL,
  ignore_unsubscribe bool NOT NULL DEFAULT true,
  	lang varchar(255) NOT NULL,
    subject varchar(255) NOT NULL,
    _text varchar(255) NOT NULL,
    roles text[] NOT NULL,
    only_active_users bool NOT NULL DEFAULT true,
    _date timestamptz NOT NULL,
    service_name_id uuid NULL,
    	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
    	deleted_at timestamptz NULL,
	CONSTRAINT emails_pkey PRIMARY KEY (id),
    	CONSTRAINT emails_service_name_id_fkey FOREIGN KEY (service_name_id) REFERENCES service_names(id) ON UPDATE CASCADE ON DELETE CASCADE,
);

CREATE TABLE public.faqitems (
	id uuid NOT NULL,
    roles text[] NOT NULL,
    lang varchar(255) NOT NULL,
    key_words varchar(255) NOT NULL,
    question_id uuid NULL,
    answer_id uuid NULL,
    faq_statistic_id uuid NULL,
    	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
    	deleted_at timestamptz NULL,
	CONSTRAINT faqitems_pkey PRIMARY KEY (id),
    	CONSTRAINT faqitems_question_id_fkey FOREIGN KEY (question_id) REFERENCES questions(id) ON UPDATE CASCADE ON DELETE CASCADE,
      CONSTRAINT faqitems_answer_id_fkey FOREIGN KEY (answer_id) REFERENCES answers(id) ON UPDATE CASCADE ON DELETE CASCADE,
      CONSTRAINT faqitems_faq_statistic_id_fkey FOREIGN KEY (faq_statistic_id) REFERENCES faq_statistics(id) ON UPDATE CASCADE ON DELETE CASCADE,
);

CREATE TABLE public.patients (
	id uuid NOT NULL,
    specialists text[] NOT NULL,
    first_login bool NOT NULL DEFAULT true,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    gender varchar(255) NOT NULL,
    date_of_birth timestamptz NOT NULL,
    date_of_registration timestamptz NOT NULL,
    date_of_writingOut timestamptz NOT NULL,
    first_time_add_game bool NOT NULL DEFAULT true,
    patient_status varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    height integer NOT NULL,
    weight integer NOT NULL,
    nickname varchar(255) NOT NULL,
    address varchar(255) NOT NULL,
    phone_number varchar(255) NOT NULL,
    goal_rehabilitation varchar(255) NOT NULL,
    medical_history varchar(255) NOT NULL,
    hospital_id uuid NULL,
    user_id uuid NULL,
    patientDiagnosis_id uuid NULL,
    achievement_id uuid NULL,
    	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
    	deleted_at timestamptz NULL,
	CONSTRAINT patients_pkey PRIMARY KEY (id),
    	CONSTRAINT patients_hospital_id_fkey FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON UPDATE CASCADE ON DELETE CASCADE,
      CONSTRAINT patients_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
      CONSTRAINT patients_patientDiagnosis_id_fkey FOREIGN KEY (patientDiagnosis_id) REFERENCES patientDiagnosis(id) ON UPDATE CASCADE ON DELETE CASCADE,
      CONSTRAINT patients_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON UPDATE CASCADE ON DELETE CASCADE,
);

CREATE TABLE public.settings (
	id uuid NOT NULL,
  work_type integer NOT NULL,
  on_r_hand bool NOT NULL DEFAULT true,
  button1 integer NOT NULL,
  button2 integer NOT NULL,
  button3 integer NOT NULL,
  button4 integer NOT NULL,
  button5 integer NOT NULL,
  btn_sens_left integer NOT NULL,
  btn_sens_right integer NOT NULL,
  btn_j_right integer NOT NULL,
    btn_j_left integer NOT NULL,
    btn_j_down integer NOT NULL,
    btn_j_up integer NOT NULL,
    key_sens integer NOT NULL,
    mouse_sens integer NOT NULL,
    mouse_sens_y integer NOT NULL,
    no_PWM bool NOT NULL DEFAULT true,
    no_auto_slide bool NOT NULL DEFAULT true,
    left integer NOT NULL,
    down integer NOT NULL,
    up integer NOT NULL,
    right integer NOT NULL,
    global bool NOT NULL DEFAULT true,
    no_mouse bool NOT NULL DEFAULT true,
    t_p_delta bool NOT NULL DEFAULT true,
    br_mode bool NOT NULL DEFAULT true,
    work_mode bool NOT NULL DEFAULT true,
    	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
    	deleted_at timestamptz NULL,
	CONSTRAINT settings_pkey PRIMARY KEY (id),
);

CREATE TABLE public.patientlidachievements (
	id uuid NOT NULL,
  training_names text[] NOT NULL,
  time_of_trainings text[] NOT NULL,
  repeats_of_trainings text[] NOT NULL,
  answers_count integer NOT NULL,
    	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
    	deleted_at timestamptz NULL,
	CONSTRAINT patientlidachievements_pkey PRIMARY KEY (id),
);

CREATE TABLE public.hospitalbankaccounts (
	id uuid NOT NULL,
  	translations text[] NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
  CONSTRAINT hospitalbankaccounts_pkey PRIMARY KEY (id),
);

CREATE TABLE public.exercisetranslations (
	id uuid NOT NULL,
  company_name varchar(255) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
  CONSTRAINT exercisetranslations_pkey PRIMARY KEY (id),
);

CREATE TABLE public.games (
	id uuid NOT NULL,
    	name integer NOT NULL,
	comment varchar(255) NOT NULL,
  link varchar(255) NOT NULL,
  path varchar(255) NOT NULL,
    	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
    	deleted_at timestamptz NULL,
    	patient_id uuid NULL,
    	settings_id uuid NULL,
	CONSTRAINT games_pkey PRIMARY KEY (id),
    	CONSTRAINT games_settings_id_fkey FOREIGN KEY (settings_id) REFERENCES settings(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT games_settings_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES patients(id) ON UPDATE CASCADE ON DELETE CASCADE,
);

CREATE TABLE public.specialiststatuses (
	id uuid NOT NULL,
  lang varchar(255) NOT NULL,
  status varchar(255) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
  CONSTRAINT specialiststatuses_pkey PRIMARY KEY (id),
);

CREATE TABLE public.icfqualifiers (
	id uuid NOT NULL,
  name varchar(255) NOT NULL,
  description varchar(255) NOT NULL,
  value varchar(255) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
  CONSTRAINT icfqualifiers_pkey PRIMARY KEY (id),
);

CREATE TABLE public.repeatsoftrainings (
	id uuid NOT NULL,
  repeats integer NOT NULL,
  _date timestamptz NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
  CONSTRAINT repeatsoftrainings_pkey PRIMARY KEY (id),
);

CREATE TABLE public.icflinks (
	id uuid NOT NULL,
  name varchar(255) NOT NULL,
  code varchar(255) NOT NULL,
  description varchar(255) NOT NULL,
  type varchar(255) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
  CONSTRAINT icflinks_pkey PRIMARY KEY (id),
);

CREATE TABLE public.phoneplacements (
	id uuid NOT NULL,
  name varchar(255) NOT NULL,
  url varchar(255) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
  CONSTRAINT phoneplacements_pkey PRIMARY KEY (id),
);

CREATE TABLE public.specialistspecializations (
	id uuid NOT NULL,
  lang varchar(255) NOT NULL,
  specialization_id uuid NULL,
    	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
    	deleted_at timestamptz NULL,
	CONSTRAINT specialistspecializations_pkey PRIMARY KEY (id),
  CONSTRAINT specialistspecializations_specialization_id_fkey FOREIGN KEY (specialization_id) REFERENCES specializations(id) ON UPDATE CASCADE ON DELETE CASCADE,
);

CREATE TABLE public.patientstatuses (
	id uuid NOT NULL,
  lang varchar(255) NOT NULL,
  status varchar(255) NOT NULL,
    	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
    	deleted_at timestamptz NULL,
	CONSTRAINT patientstatuses_pkey PRIMARY KEY (id),
);

CREATE TABLE public.countries (
	id uuid NOT NULL,
  name varchar(255) NOT NULL,
  code varchar(255) NOT NULL,
    	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
    	deleted_at timestamptz NULL,
	CONSTRAINT countries_pkey PRIMARY KEY (id),
);

CREATE TABLE public.hospitalstatuses (
	id uuid NOT NULL,
  name varchar(255) NOT NULL,
  lang varchar(255) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
  CONSTRAINT hospitalstatuses_pkey PRIMARY KEY (id),
);
