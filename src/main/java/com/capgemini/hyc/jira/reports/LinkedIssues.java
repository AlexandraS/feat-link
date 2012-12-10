package com.capgemini.hyc.jira.reports;

import com.atlassian.query.Query;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.IssueManager;
import com.atlassian.jira.issue.link.IssueLinkManager;
import com.atlassian.jira.issue.link.LinkCollection;
import com.atlassian.jira.issue.search.SearchException;
import com.atlassian.jira.issue.search.SearchProvider;
import com.atlassian.jira.issue.search.SearchResults;
import com.atlassian.jira.jql.builder.JqlQueryBuilder;
import com.atlassian.jira.plugin.report.impl.AbstractReport;
import com.atlassian.jira.web.action.ProjectActionSupport;
import com.atlassian.jira.web.bean.PagerFilter;
import com.atlassian.jira.util.ParameterUtils;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * 
 * @author Maja
 *
 *Diese Klasse Erstellt eine Liste aller Objekte, die zu einem Feature gelinked sind
 */
public class LinkedIssues extends AbstractReport {
	
	final IssueManager manager;
	final IssueLinkManager linkManager;
	final SearchProvider searchProvider;
	/**
	 * Konstruktor
	 * @param manager
	 * @param linkManager
	 */
	public LinkedIssues(final IssueManager manager, final IssueLinkManager linkManager, final SearchProvider searchProvider){
		this.manager = manager;
		this.linkManager = linkManager;
		this.searchProvider = searchProvider;
	}
	/**
	 * Diese Methode generiert die html-Ausgabe
	 */
    @SuppressWarnings("unchecked")
	public String generateReportHtml(ProjectActionSupport action, Map map) throws Exception {
      Map <String, Object> linkedIssues = getLinkedIssues(action,map);
    	//return getLinkedIssues(action, map).toString();
    	//die folgende Zeile bitte entkommentieren, um die html-view zu nutzen, und die obere Zeile löschen, oder auskommentieren
      if(linkManager.getLinkCollection(getParams(action, map), action.getLoggedInUser()) == null){
    	 return ("Kein Objekt");
      }
      else{
      return descriptor.getHtml("html-view", linkedIssues);}
    }
    /**
     * 
     * @param action
     * @param map
     * @return Die Methode gibt eine Map, die die Linked Issues zur eingegebenen ID enthält zurück
     */
	public Map getLinkedIssues(ProjectActionSupport action, Map map){

    	LinkCollection linkCollection = linkManager.getLinkCollection(getParams(action, map), action.getLoggedInUser());
    	Collection<Issue> linkedIssues = linkCollection.getAllIssues();
    	linkCollection.getInwardIssues(getParams(action, map).getKey());
    	Object[] issues = linkedIssues.toArray();
    	//List<Issue> linked = null;
    	/**
    	 * In dieser Schleife wird die linked Map mit den Keys der gelinkten Issues gefüllt
    	 */
    		/*for (int i=0; i< issues.length; i++){    		
    			linked.add(i, issues[i].toString());
    		}*/
    	Map<String, Object> issueMap = new HashMap();
    	//List<Issue> issueList = null;
    	/**
    	 * in dieser Schleife wird die issueMap mit den linked Issues gefüllt
    	 */
    		/*for(int i =0; i < linked.size(); i++){
    			issueList.add(i, manager.getIssueObject(linked.get(i)));
    		}*/
    		issueMap.put("linkedIssues", linkedIssues);
    	return issueMap;
    	
    }
    
    
    /**
     * 
     * @param action
     * @param map
     * @return Das Issue zur eingegebenen ID
     * @throws SearchException 
     */
    public Issue getParams(ProjectActionSupport action, Map map) {
    	
    	//JqlQueryBuilder queryBuilder = JqlQueryBuilder.newBuilder();
    	//Query query = queryBuilder.where().issue(map.get("featID").toString()).buildQuery();
    	//PagerFilter<Issue> filter = new PagerFilter<Issue>().getUnlimitedFilter();
    	//SearchResults results = searchProvider.search(query, action.getLoggedInUser(), filter);
    	
    	String featureID = map.get("featID").toString();
    	Issue feature = manager.getIssueObject(featureID);
    	//queryBuilder.where().issue(linkManager.);
    	return feature;
    		
    }
    
    public void validate (ProjectActionSupport action, Map map)
    {
    	final String featID =  ParameterUtils.getStringParam(map, "featID");
    	if (featID == null)
    	{
    		action.addError("featID", action.getText("Keine Feature ID eingegeben"));
    	}
        if (ParameterUtils.getStringParam(map, "featID").isEmpty())
        {
            action.addError("featID", action.getText("Feature ID is Required"));
        }
        

    }
    public boolean showReport()
    {
    	return true;
    }
}
