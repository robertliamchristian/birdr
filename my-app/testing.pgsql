
-- Get user list
select ul.title,l.bird from user_sighting us
join user_list ul on ul.listid = us.listid
join log l on us.birdref = l.birdid
 where us.listid = 1



 -- add record to us.list
 -- POST - send bird name to query in WHERE from form
 insert into user_sighting (listid, birdref) 
 select us.listid, us.birdref
 from user_sighting us
    join log l on us.birdref = l.birdid
    where l.bird = 'American Robin';




    select * from alluser a ;
    select * from user_list ul where ul.listid = 1;
    