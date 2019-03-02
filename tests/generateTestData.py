#!/usr/bin/env python3

#====================================================================
# Syntax        : python testing/generateTestData.py
# Description   : Generate DB data for test purposes.
#                 Script must be called from the same folder.
# Prerequisites : DB must already have the tables created.
#                 Folder ../app/public/media/ must have images:
#                   + For articles: images_*
#                   + User avatars: avatars_*
# Author        : AP
# Date          : 09 Nov 2018
#--------------------------------------------------------------------


#====================================================================
# Imports
#--------------------------------------------------------------------
import os
import os.path
import glob
import random
import datetime
import json
import re
import subprocess
import pymongo


#====================================================================
# Initializations
#--------------------------------------------------------------------
dbname = 'expressBlog'
max_articles = 120
random.seed(479732)
words = ['abstineo', 'accipio', 'ad', 'adulescens', 'aequus', 'aetas', 'affero', 'alius', 'alloquor', 'alter', 'amicus', 'an', 'animus', 'annus', 'ante', 'antecapio', 'antefero', 'arma', 'attineo', 'aufero', 'aut', 'autem', 'bellum', 'bonus', 'certus', 'civis', 'civitas', 'colloquor', 'comprobo', 'computo', 'concipio', 'confero', 'conscio', 'consequor', 'contineo', 'contra', 'corpus', 'crimen', 'debeo', 'decipio', 'defero', 'deinde', 'deputo', 'detineo', 'deus', 'differo', 'dignus', 'disputo', 'do', 'dum', 'dux', 'effero', 'ego', 'eloquor', 'enim', 'eo', 'et', 'etiam', 'excipio', 'exputo', 'facilis', 'fero', 'filius', 'fio', 'gens', 'gravis', 'habeo', 'haud', 'hic', 'homo', 'hostis', 'iam', 'idem', 'ille', 'imperium', 'imputo', 'incipio', 'inde', 'infero', 'ingenium', 'inquam', 'inter', 'intercipio', 'interdico', 'interdo', 'intereo', 'interloquor', 'ipse', 'is', 'iste', 'ita', 'iudicium', 'ius', 'mater', 'miles', 'modo', 'mors', 'moveo', 'mulier', 'nam', 'ne', 'nec', 'nemo', 'neque', 'neuter', 'nihil', 'nolo', 'nomen', 'non', 'nondum', 'nos', 'nullus', 'nunc', 'obloquor', 'obtineo', 'occipio', 'occupo', 'offero', 'omnis', 'opes', 'ordo', 'pars', 'pater', 'per', 'percipio', 'perfero', 'perputo', 'pertineo', 'possum', 'post', 'postfero', 'postputo', 'potestas', 'praecipio', 'praefero', 'praeloquor', 'primus', 'principium', 'profero', 'proloquor', 'promitto', 'promoveo', 'propono', 'prosequor', 'prosum', 'provenio', 'provideo', 'provoco', 'publicus', 'qualis', 'quam', 'quantus', 'qui', 'quidam', 'quidem', 'quis', 'quisque', 'recipio', 'refero', 'regnum', 'reputo', 'retineo', 'rex', 'salvus', 'satis', 'se', 'similis', 'sol', 'solus', 'subsequor', 'substo', 'subsum', 'subvenio', 'subvereor', 'sum', 'summitto', 'summoveo', 'suppeto', 'suppono', 'suscipio', 'sustineo', 'suus', 'talis', 'tam', 'tantus', 'tempus', 'teneo', 'totus', 'traloquor', 'trans', 'transeo', 'transfero', 'transmitto', 'transmoveo', 'transpono', 'transtineo', 'tu', 'tuus', 'ubi', 'ullus', 'unde', 'unus', 'urbs', 'uter', 'uxor', 'vereor', 'verus', 'vester', 'video', 'vir', 'virtus', 'volo', 'vos']
topics = ['Aerospace', 'Agriculture', 'Automotive', 'Electrical & Electronics', 'General', 'Green Energy', 'IT & Computing', 'Medical', 'Telecommunications']
names = ['Aditya Kumar', 'Bonita Crittendon', 'Christal Delrosario', 'Davis Stump', 'Florencia Schurman', 'Francis Lamkin', 'Graham Velarde', 'Kristie Luna', 'Mesha Mukhopadhyay', 'Porsche Lunn', 'Shandra Craner', 'Wally Rains']
images = [os.path.basename(f) for f in glob.glob('../app/public/media/images_*')]
avatars = [os.path.basename(f) for f in glob.glob('../app/public/media/avatars_*')]
domains = ['yahoo.com.uk', 'gmail.com', 'outlook.com', 'rediff.com']


#====================================================================
# Functions
#--------------------------------------------------------------------
def get_words(min=4, max=15):
    ''' Get a random number of words within specified limits.
    '''
    return random.sample(words, random.randint(min, max))


def get_sentence(min=8, max=15, is_title=False):
    ''' Get a sentence with a random number of words within 
        specified limits. Return a sentence including a terminating
        period unless it is a title.
    '''
    words = get_words(min, max)
    if is_title:
        sentence = ' '.join(words).title()
    else:
        sentence = ' '.join(words).capitalize() + '.'
    return sentence


def get_paragraph(min=4, max=8):
    ''' Get a paragraph with a random number of sentences within
        specified limits.
    '''
    para = []
    for i in range(random.randint(min, max)):
        para.append(get_sentence())
    return ' '.join(para)


def get_paragraphs(min=6, max=12):
    ''' Get a random number of paragraphs within specified limits.
    '''
    paras = []
    for _ in range(random.randint(min, max)):
        paras.append(get_paragraph())
    return '\n'.join(paras)


def get_random_past_time(ref, low, high):
    ''' Get a random time in the past from the specified reference.
        Offset is random based on low and high values.
        Returns a datetime object.
    '''
    delta = datetime.timedelta(days=random.randint(low,high),
                               minutes=random.randint(low,high*10),
                               seconds=random.randint(low,high*10))
    return ref-delta


def mdb_delete(db, coll):
    db[coll].delete_many({})
    return "db.{}.deleteMany({{}})".format(coll)


def mdb_insert(db, coll, records):
    db[coll].insert_many(records)
    return


def generate_users(db):
    ''' Generate users from global variable.
    '''
    coll = 'users'
    cmds = []

    cmds.append(mdb_delete(db, coll))

    records = []
    for i, name in enumerate(names):
        first_name, last_name = name.strip().split()

        # Take first user as admin
        if i == 0:
            username = 'admin'
        else:
            username = '{}.{}'.format(first_name, last_name[:1]).lower()

        # Password is encrypted form of 'devopedia'
        fields = {
            'email': '{}@{}'.format(username, random.choice(domains)),
            'username': username,
            'firstname': first_name,
            'lastname': last_name,
            'password': '$2b$10$eI1b9.ulIZPr3Hz1GOf7RO4HIsEr3z48bgYHTkWy5h2VUf8YW9Xfi',
            'profile': get_paragraphs(1, 3),
            'avatarImgPath': avatars[i % len(avatars)],
        }
        records.append(fields)

    mdb_insert(db, coll, records)

    return records


def generate_topics(db):
    ''' Generate topics from global variable.
    '''
    coll = 'topics'
    cmds = []

    cmds.append(mdb_delete(db, coll))

    records = []
    for topic in topics:
        fields = {
            'title': topic,
            'description': get_paragraph(2, 2),
            'teaserImgPath': "/images/topics/{}.jpg".format(re.sub(r'[\s&]+', '-', topic.lower()))
        }
        records.append(fields)

    mdb_insert(db, coll, records)

    return records


def generate_articles(db, options):
    ''' Generate articles with mapping to author and topic.
    '''
    coll = 'articles'
    cmds = []

    cmds.append(mdb_delete(db, coll))

    records = []
    for _ in range(options['count']):
        state = random.choice(['draft', 'published', 'deleted'])
        if state != 'draft':
            ud = get_random_past_time(datetime.datetime.now(), 1, 100)
            pd =  get_random_past_time(ud, 1, 10) # implies always updated after publishing
            cd = get_random_past_time(pd, 1, 10)
        else:
            ud = get_random_past_time(datetime.datetime.now(), 1, 20)
            pd = 'NULL'
            cd = get_random_past_time(ud, 1, 10)

        fields = {
            'title': get_sentence(is_title=True),
            'text': get_paragraphs(),
            'teaserImgPath': random.choice(images),
            'state': state,
            'createdAt': str(cd),
            'updatedAt': str(cd),
            'publishedAt': str(pd),
            'meta': {
                'featured': random.choice([True, False]),
                'claps': random.randint(0, 20)
            },
            'authorId': random.choice(options['users'])['_id'],
            'topicId': random.choice(options['topics'])['_id']
        }
        records.append(fields)

    mdb_insert(db, coll, records)


#====================================================================
# Main Processing
#--------------------------------------------------------------------
if __name__ == '__main__':
    with pymongo.MongoClient() as client:
        db = client[dbname]
        users = generate_users(db)
        topics = generate_topics(db)
        generate_articles(db, {
            'count': max_articles,
            'users': users,
            'topics': topics
        })
