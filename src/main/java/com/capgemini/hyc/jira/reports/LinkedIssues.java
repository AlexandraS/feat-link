package com.capgemini.hyc.jira.reports;

import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.issue.IssueManager;
import com.atlassian.jira.issue.link.IssueLinkManager;
import com.atlassian.jira.issue.link.LinkCollection;
import com.atlassian.jira.plugin.report.impl.AbstractReport;
import com.atlassian.jira.web.action.ProjectActionSupport;
import com.atlassian.jira.util.ParameterUtils;

import java.util.Collection;
import java.util.HashMap;
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
	/**
	 * Konstruktor
	 * @param manager
	 * @param linkManager
	 */
	public LinkedIssues(final IssueManager manager, final IssueLinkManager linkManager){
		this.manager = manager;
		this.linkManager = linkManager;
	}
	/**
	 * Diese Methode generiert die html-Ausgabe
	 */
    public String generateReportHtml(ProjectActionSupport action, Map map) throws Exception {
       
    	return getLinkedIssues(action,map).toString();
    	//die folgende Zeile bitte entkommentieren, um die html-view zu nutzen, und die obere Zeile löschen, oder auskommentieren
    	//return descriptor.getHtml("html-view", getLinkedIssues(action,map));
    }
    /**
     * 
     * @param action
     * @param map
     * @return Eine Map, die die Linked Issues zur eingegebenen ID enthalten
     */
    public Map getLinkedIssues(ProjectActionSupport action, Map map){
    	
    	LinkCollection linkCollection = linkManager.getLinkCollection(getIssue(action, map), action.getLoggedInUser());
    	Collection<Issue> linkIssues = linkCollection.getAllIssues();
    	linkCollection.getInwardIssues(getIssue(action, map).getKey());
    	Object[] issues = linkIssues.toArray();
    	Map<Integer, String> linked = new HashMap();
    	/**
    	 * In dieser Schleife wird die linked Map mit den Keys der gelinkten Issues gefüllt
    	 */
    		for (int i=0; i< issues.length; i++){    		
    			linked.put(i, issues[i].toString());
    		}
    	Map<String, Issue> issueMap = new HashMap();
    	/**
    	 * in dieser Schleife wird die issueMap mit denlinked Issues gefüllt
    	 */
    		for(int i =0; i < linked.size(); i++){
    			issueMap.put("linkedIssues", manager.getIssueObject(linked.get(i)));
    		}
    	return issueMap;
    	
    }
    /**
     * 
     * @param action
     * @param map
     * @return Das Issue zur eingegebenen ID
     */
    public Issue getIssue(ProjectActionSupport action, Map map){
    	
    	String featureID = map.get("featID").toString();
    	Issue feature = manager.getIssueObject(featureID);
    	return feature;
    	
    }
}
