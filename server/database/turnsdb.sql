create type user_role as enum ('client', 'employee', 'admin');

alter type user_role owner to jiechevarria;

create table if not exists users
(
    id_user      uuid      default uuid_generate_v4() not null
        primary key,
    name         varchar(255)                         not null,
    email        varchar(255)                         not null,
    password     char(60)                             not null,
    phone_number varchar(20)                          not null,
    role         user_role default 'client'::user_role
);

alter table users
    owner to jiechevarria;

create table if not exists services
(
    id_service uuid    default uuid_generate_v4() not null
        primary key,
    name       varchar(255)                       not null,
    duration   integer                            not null,
    price      integer                            not null,
    is_active  boolean default true               not null
);

alter table services
    owner to jiechevarria;

create table if not exists turns
(
    id_turn    uuid    default uuid_generate_v4() not null
        primary key,
    date_time  timestamp with time zone           not null,
    available  boolean default true               not null,
    user_id    uuid
        references users,
    service_id uuid
        references services
);

alter table turns
    owner to jiechevarria;

create function uuid_nil() returns uuid
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function uuid_nil() owner to postgres;

grant execute on function uuid_nil() to jiechevarria;

create function uuid_ns_dns() returns uuid
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function uuid_ns_dns() owner to postgres;

grant execute on function uuid_ns_dns() to jiechevarria;

create function uuid_ns_url() returns uuid
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function uuid_ns_url() owner to postgres;

grant execute on function uuid_ns_url() to jiechevarria;

create function uuid_ns_oid() returns uuid
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function uuid_ns_oid() owner to postgres;

grant execute on function uuid_ns_oid() to jiechevarria;

create function uuid_ns_x500() returns uuid
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function uuid_ns_x500() owner to postgres;

grant execute on function uuid_ns_x500() to jiechevarria;

create function uuid_generate_v1() returns uuid
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function uuid_generate_v1() owner to postgres;

grant execute on function uuid_generate_v1() to jiechevarria;

create function uuid_generate_v1mc() returns uuid
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function uuid_generate_v1mc() owner to postgres;

grant execute on function uuid_generate_v1mc() to jiechevarria;

create function uuid_generate_v3(namespace uuid, name text) returns uuid
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function uuid_generate_v3(uuid, text) owner to postgres;

grant execute on function uuid_generate_v3(uuid, text) to jiechevarria;

create function uuid_generate_v4() returns uuid
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function uuid_generate_v4() owner to postgres;

grant execute on function uuid_generate_v4() to jiechevarria;

create function uuid_generate_v5(namespace uuid, name text) returns uuid
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function uuid_generate_v5(uuid, text) owner to postgres;

grant execute on function uuid_generate_v5(uuid, text) to jiechevarria;


